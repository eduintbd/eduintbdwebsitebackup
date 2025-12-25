import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Upload, Eye, Trash2, CheckCircle2, FileText, AlertCircle, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DocumentUploadProps {
  userId: string;
  userEmail: string;
  documents: any; // string[] (preferred) or legacy objects with fileName
  onDocumentsChange: () => void;
  studentName?: string; // Optional: used for display in admin view
}

type StoredDocPath = string;

type RequiredDoc = {
  name: string;
  required: boolean;
};

const REQUIRED_DOCS: RequiredDoc[] = [
  { name: "Passport Copy", required: true },
  { name: "Academic Transcripts", required: true },
  { name: "English Test Scores (IELTS/TOEFL)", required: true },
  { name: "Statement of Purpose", required: true },
  { name: "Recommendation Letters", required: false },
  { name: "Financial Documents", required: true },
];

const CUSTOM_DOC_VALUE = "__custom__";

function normalizeStoredPaths(docs: any): StoredDocPath[] {
  if (!docs || !Array.isArray(docs)) return [];

  const paths: StoredDocPath[] = [];
  for (const item of docs) {
    if (typeof item === "string") {
      paths.push(item);
      continue;
    }
    // legacy object format (if any)
    if (item && typeof item === "object" && typeof item.fileName === "string") {
      paths.push(item.fileName);
    }
  }

  return paths;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

const PATH_SLASH_TOKEN = "__slash__";

function encodeDocNameForPath(name: string) {
  // IMPORTANT: storage paths treat "/" as a folder delimiter.
  // We encode it so document names like "IELTS/TOEFL" stay in a single object key.
  return name.split("/").join(PATH_SLASH_TOKEN);
}

function decodeDocNameFromPath(name: string) {
  return name.split(PATH_SLASH_TOKEN).join("/");
}

function fileBaseFromPath(filePath: string) {
  const segments = filePath.split("/");
  // Paths are stored as: "<userId>/<docName>--<timestamp>--<remark>.ext".
  // Some legacy uploads may include "/" inside the docName, which becomes extra segments.
  const withoutUserPrefix = segments.length > 1 ? segments.slice(1).join("/") : segments[0];
  return (withoutUserPrefix || "").replace(/\.[^/.]+$/, "");
}

function parseDocNameFromPath(filePath: string) {
  const base = fileBaseFromPath(filePath);

  // New format: "NAME--TIMESTAMP--REMARK"
  if (base.includes("--")) {
    const [name] = base.split("--");
    return decodeDocNameFromPath(name || "Document");
  }

  // Old format: "NAME-<timestamp>"
  const lastDash = base.lastIndexOf("-");
  if (lastDash > 0) {
    const maybeTs = base.slice(lastDash + 1);
    if (/^\d+$/.test(maybeTs)) return decodeDocNameFromPath(base.slice(0, lastDash) || "Document");
  }

  return decodeDocNameFromPath(base || "Document");
}

function parseRemarkFromPath(filePath: string) {
  const base = fileBaseFromPath(filePath);
  if (!base.includes("--")) return undefined;
  const parts = base.split("--");
  return parts[2] || undefined;
}

export function DocumentUpload({ userId: _userId, userEmail, documents, onDocumentsChange, studentName }: DocumentUploadProps) {
  const [selectedDoc, setSelectedDoc] = useState<string>("");
  const [customDocName, setCustomDocName] = useState("");
  const [remark, setRemark] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<{ name: string; filePath: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const storedPaths = useMemo(() => normalizeStoredPaths(documents), [documents]);

  const uploadedDocs = useMemo(() => {
    return storedPaths.map((filePath) => ({
      filePath,
      name: parseDocNameFromPath(filePath),
      remark: parseRemarkFromPath(filePath),
    }));
  }, [storedPaths]);

  const uploadedNameSet = useMemo(() => {
    return new Set(uploadedDocs.map((d) => d.name.toLowerCase()));
  }, [uploadedDocs]);

  const effectiveDocName = selectedDoc === CUSTOM_DOC_VALUE ? customDocName.trim() : selectedDoc.trim();

  const ensureDocSelected = () => {
    if (effectiveDocName) return true;

    toast({
      title: "Select a Document",
      description: "Please tick a document name from the checklist before uploading.",
      variant: "destructive",
    });
    return false;
  };

  const openFileDialog = () => {
    if (!ensureDocSelected()) return;
    fileInputRef.current?.click();
  };

  const uploadFile = async (file: File) => {
    if (!ensureDocSelected()) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to upload documents");

      const fileExt = file.name.split(".").pop() || "bin";
      const remarkSlug = remark.trim() ? slugify(remark) : "";
      const safeDocName = encodeDocNameForPath(effectiveDocName);
      const fileName = `${user.id}/${safeDocName}--${Date.now()}${remarkSlug ? `--${remarkSlug}` : ""}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("student-documents")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const nextPaths = [...storedPaths, fileName];
      const { error: updateError } = await supabase
        .from("student_applications")
        .update({
          document_urls: nextPaths as any,
          documents_uploaded: true,
        })
        .eq("email", userEmail);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Document uploaded successfully.",
      });

      setRemark("");
      onDocumentsChange();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const handlePreview = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("student-documents")
        .createSignedUrl(filePath, 60);

      if (error) throw error;

      setPreviewUrl(data.signedUrl);
      setPreviewDoc({ name: parseDocNameFromPath(filePath), filePath });
    } catch {
      toast({
        title: "Error",
        description: "Failed to load preview",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (filePath: string, docName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("student-documents")
        .createSignedUrl(filePath, 60);

      if (error) throw error;

      // Create download link with proper filename
      const link = document.createElement("a");
      link.href = data.signedUrl;
      
      // Format: "Document Name - Student Name.ext"
      const ext = filePath.split(".").pop() || "pdf";
      const downloadName = studentName 
        ? `${docName} - ${studentName}.${ext}`
        : `${docName}.${ext}`;
      
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: "Document download started.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (filePath: string) => {
    try {
      const { error: deleteError } = await supabase.storage
        .from("student-documents")
        .remove([filePath]);

      if (deleteError) throw deleteError;

      const updatedPaths = storedPaths.filter((p) => p !== filePath);
      const { error: updateError } = await supabase
        .from("student_applications")
        .update({
          document_urls: updatedPaths as any,
          documents_uploaded: updatedPaths.length > 0,
        })
        .eq("email", userEmail);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Document deleted successfully.",
      });
      onDocumentsChange();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const setDocSelection = (value: string) => {
    setSelectedDoc(value);
    if (value !== CUSTOM_DOC_VALUE) {
      setCustomDocName("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Required Documents Checklist (select/tick one before upload) */}
      <Card className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-sm font-medium">Required Documents Checklist</p>
            <p className="text-xs text-muted-foreground">
              Tick the document name for the file you’re uploading.
            </p>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {uploadedDocs.length} uploaded
          </Badge>
        </div>

        <div className="space-y-2">
          {REQUIRED_DOCS.map((doc) => {
            const uploaded = uploadedNameSet.has(doc.name.toLowerCase());
            const selected = selectedDoc === doc.name;

            return (
              <button
                key={doc.name}
                type="button"
                onClick={() => setDocSelection(doc.name)}
                className={cn(
                  "w-full text-left flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors",
                  selected ? "bg-accent/10" : "hover:bg-accent/5"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {uploaded ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        variant={uploaded ? "default" : "outline"}
                        className="text-xs"
                      >
                        {uploaded ? "uploaded" : "pending"}
                      </Badge>
                      {doc.required && (
                        <Badge variant="secondary" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Checkbox checked={selected} aria-label={`Select ${doc.name}`} />
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setDocSelection(CUSTOM_DOC_VALUE)}
            className={cn(
              "w-full text-left flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors",
              selectedDoc === CUSTOM_DOC_VALUE ? "bg-accent/10" : "hover:bg-accent/5"
            )}
          >
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">Other / Custom document</p>
                <p className="text-xs text-muted-foreground truncate">
                  Use this if your document isn’t in the checklist.
                </p>
              </div>
            </div>
            <Checkbox checked={selectedDoc === CUSTOM_DOC_VALUE} aria-label="Select custom document" />
          </button>

          {selectedDoc === CUSTOM_DOC_VALUE && (
            <div className="pt-2">
              <Label htmlFor="custom-doc-name">Document Name</Label>
              <Input
                id="custom-doc-name"
                value={customDocName}
                onChange={(e) => setCustomDocName(e.target.value)}
                disabled={uploading}
                className="mt-2"
                placeholder="e.g., Bank Statement, CV"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Upload Area */}
      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <div>
            <Label>Upload File</Label>
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") openFileDialog();
              }}
              onClick={openFileDialog}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={cn(
                "mt-2 rounded-lg border border-dashed p-6 transition-colors",
                "bg-muted/20 hover:bg-muted/30",
                isDragging && "bg-accent/10 border-accent"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md border bg-background flex items-center justify-center">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    Drag & drop your file here, or click to choose
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Allowed: PDF, JPG, PNG, DOC, DOCX
                  </p>
                  {effectiveDocName && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      Uploading as: <span className="font-medium">{effectiveDocName}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
          </div>

          <div>
            <Label htmlFor="doc-remark">Remark (optional)</Label>
            <Input
              id="doc-remark"
              placeholder="Optional note"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              disabled={uploading}
              className="mt-2"
            />
          </div>

          <Button onClick={openFileDialog} disabled={uploading} className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Upload Document"}
          </Button>
        </div>
      </Card>

      {/* Uploaded Documents */}
      {uploadedDocs.length > 0 && (
        <Card className="p-4">
          <p className="text-sm font-medium mb-3">
            Uploaded Documents ({uploadedDocs.length})
            {studentName && <span className="text-muted-foreground"> - {studentName}</span>}:
          </p>
          <div className="space-y-2">
            {uploadedDocs.map((doc, idx) => (
              <div
                key={`${doc.filePath}-${idx}`}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {doc.name}
                      {studentName && (
                        <span className="text-muted-foreground font-normal"> - {studentName}</span>
                      )}
                    </p>
                    {doc.remark && (
                      <p className="text-xs text-muted-foreground truncate">{doc.remark}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePreview(doc.filePath)}
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(doc.filePath, doc.name)}
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(doc.filePath)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {previewDoc?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-auto">
            {previewUrl && (
              <iframe
                src={previewUrl}
                className="w-full h-[70vh] border rounded"
                title="Document Preview"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
