import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Eye, Trash2, CheckCircle2, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DocumentMetadata {
  name: string;
  fileName: string;
  remark?: string;
  uploadedAt: string;
}

interface DocumentUploadProps {
  userId: string;
  userEmail: string;
  documents: any; // Can be string[] (legacy) or DocumentMetadata[]
  onDocumentsChange: () => void;
}

// Helper to normalize documents to new format
function normalizeDocuments(docs: any): DocumentMetadata[] {
  if (!docs || !Array.isArray(docs)) return [];
  
  return docs.map((doc, index) => {
    // If it's already in the new format
    if (typeof doc === 'object' && doc.name && doc.fileName) {
      return doc as DocumentMetadata;
    }
    // Legacy format: just a string (file path)
    return {
      name: `Document ${index + 1}`,
      fileName: doc as string,
      uploadedAt: new Date().toISOString(),
    };
  });
}

export function DocumentUpload({ userId, userEmail, documents, onDocumentsChange }: DocumentUploadProps) {
  const [documentName, setDocumentName] = useState("");
  const [remark, setRemark] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewDocument, setPreviewDocument] = useState<DocumentMetadata | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const normalizedDocs = normalizeDocuments(documents);

  const handleUploadClick = () => {
    if (!documentName.trim()) {
      toast({
        title: "Document Name Required",
        description: "Please enter a document name before uploading.",
        variant: "destructive",
      });
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Get the authenticated user's ID for storage path (RLS requires auth.uid())
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in to upload documents");
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${documentName.trim()}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('student-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const newDocument: DocumentMetadata = {
        name: documentName.trim(),
        fileName,
        remark: remark.trim() || undefined,
        uploadedAt: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from('student_applications')
        .update({
          document_urls: [...normalizedDocs, newDocument] as any,
          documents_uploaded: true,
        })
        .eq('email', userEmail);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Document uploaded successfully!",
      });

      setDocumentName("");
      setRemark("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      onDocumentsChange();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handlePreview = async (doc: DocumentMetadata) => {
    try {
      const { data, error } = await supabase.storage
        .from('student-documents')
        .createSignedUrl(doc.fileName, 60);

      if (error) throw error;

      setPreviewUrl(data.signedUrl);
      setPreviewDocument(doc);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load preview",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (doc: DocumentMetadata) => {
    try {
      const { error: deleteError } = await supabase.storage
        .from('student-documents')
        .remove([doc.fileName]);

      if (deleteError) throw deleteError;

      const updatedDocs = normalizedDocs.filter(d => d.fileName !== doc.fileName);
      const { error: updateError } = await supabase
        .from('student_applications')
        .update({
          document_urls: updatedDocs as any,
          documents_uploaded: updatedDocs.length > 0,
        })
        .eq('email', userEmail);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Document deleted successfully!",
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

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-[2fr_1fr_2fr_auto] gap-4 items-end">
        <div>
          <Label htmlFor="doc-name">
            Document Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="doc-name"
            placeholder="e.g., Transcript, Passport"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            disabled={uploading}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="doc-remark">Remark</Label>
          <Input
            id="doc-remark"
            placeholder="Optional note"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            disabled={uploading}
            className="mt-2"
          />
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
        </div>
        <Button
          onClick={handleUploadClick}
          disabled={uploading || !documentName.trim()}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? "Uploading..." : "Upload Document"}
        </Button>
      </div>

      {normalizedDocs.length > 0 && (
        <Card className="p-4">
          <p className="text-sm font-medium mb-3">
            Uploaded Documents ({normalizedDocs.length}):
          </p>
          <div className="space-y-2">
            {normalizedDocs.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    {doc.remark && (
                      <p className="text-xs text-muted-foreground truncate">
                        {doc.remark}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePreview(doc)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(doc)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {previewDocument?.name}
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
