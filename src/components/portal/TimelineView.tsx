import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle2, Clock, AlertCircle, Edit2, Save, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Required documents list - must match DocumentUpload component
const REQUIRED_DOCS = [
  "Passport Copy",
  "Academic Transcripts",
  "English Test Scores (IELTS/TOEFL)",
  "Statement of Purpose",
  "Financial Documents",
];

const PATH_SLASH_TOKEN = "__slash__";

function decodeDocNameFromPath(name: string) {
  return name.split(PATH_SLASH_TOKEN).join("/");
}

function fileBaseFromPath(filePath: string) {
  const segments = filePath.split("/");
  const withoutUserPrefix = segments.length > 1 ? segments.slice(1).join("/") : segments[0];
  return (withoutUserPrefix || "").replace(/\.[^/.]+$/, "");
}

function parseDocNameFromPath(filePath: string) {
  const base = fileBaseFromPath(filePath);
  if (base.includes("--")) {
    const [name] = base.split("--");
    return decodeDocNameFromPath(name || "Document");
  }
  const lastDash = base.lastIndexOf("-");
  if (lastDash > 0) {
    const maybeTs = base.slice(lastDash + 1);
    if (/^\d+$/.test(maybeTs)) return decodeDocNameFromPath(base.slice(0, lastDash) || "Document");
  }
  return decodeDocNameFromPath(base || "Document");
}

interface TimelineViewProps {
  application: any;
  onUpdate?: () => void;
}

export function TimelineView({ application, onUpdate }: TimelineViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Calculate document upload status based on actual uploaded documents
  const documentStatus = useMemo(() => {
    const docs = application?.document_urls;
    if (!docs || !Array.isArray(docs) || docs.length === 0) {
      return { status: "pending" as const, count: 0, total: REQUIRED_DOCS.length };
    }

    // Get uploaded document names
    const uploadedNames = new Set(
      docs.map((path: string) => parseDocNameFromPath(path).toLowerCase())
    );

    // Count how many required docs are uploaded
    const uploadedRequiredCount = REQUIRED_DOCS.filter(
      (docName) => uploadedNames.has(docName.toLowerCase())
    ).length;

    if (uploadedRequiredCount >= REQUIRED_DOCS.length) {
      return { status: "completed" as const, count: uploadedRequiredCount, total: REQUIRED_DOCS.length };
    } else if (uploadedRequiredCount > 0) {
      return { status: "in-progress" as const, count: uploadedRequiredCount, total: REQUIRED_DOCS.length };
    }
    return { status: "pending" as const, count: 0, total: REQUIRED_DOCS.length };
  }, [application?.document_urls]);

  const [editableFields, setEditableFields] = useState({
    consultation_completed: application?.consultation_completed || false,
    documents_uploaded: documentStatus.status === "completed",
    offer_letter_received: application?.offer_letter_received || false,
    cas_received: application?.cas_received || false,
    deposit_paid: application?.deposit_paid || false,
  });

  const handleToggle = (field: keyof typeof editableFields) => {
    setEditableFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('student_applications')
        .update({
          consultation_completed: editableFields.consultation_completed,
          documents_uploaded: editableFields.documents_uploaded,
          offer_letter_received: editableFields.offer_letter_received,
          cas_received: editableFields.cas_received,
          deposit_paid: editableFields.deposit_paid,
          updated_at: new Date().toISOString()
        })
        .eq('id', application.id);

      if (error) throw error;

      toast({
        title: "Progress Updated",
        description: "Your application progress has been saved."
      });
      
      setIsEditing(false);
      onUpdate?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update progress.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditableFields({
      consultation_completed: application?.consultation_completed || false,
      documents_uploaded: application?.documents_uploaded || false,
      offer_letter_received: application?.offer_letter_received || false,
      cas_received: application?.cas_received || false,
      deposit_paid: application?.deposit_paid || false,
    });
    setIsEditing(false);
  };

  const milestones = [
    {
      title: "Application Submitted",
      date: application?.created_at,
      status: "completed",
      icon: CheckCircle2,
      editable: false,
    },
    {
      title: "Initial Consultation",
      date: application?.session_date,
      status: editableFields.consultation_completed ? "completed" : "pending",
      icon: editableFields.consultation_completed ? CheckCircle2 : Clock,
      editable: true,
      field: "consultation_completed" as const,
      label: "Consultation completed",
    },
    {
      title: "Document Submission",
      date: null,
      status: documentStatus.status,
      icon: documentStatus.status === "completed" ? CheckCircle2 : 
            documentStatus.status === "in-progress" ? AlertCircle : Clock,
      editable: false, // Auto-calculated from actual uploads
      description: documentStatus.status !== "pending" 
        ? `${documentStatus.count}/${documentStatus.total} required documents`
        : undefined,
    },
    {
      title: "Offer Letter",
      date: null,
      status: editableFields.offer_letter_received ? "completed" : "pending",
      icon: editableFields.offer_letter_received ? CheckCircle2 : Clock,
      editable: true,
      field: "offer_letter_received" as const,
      label: "Offer letter received",
    },
    {
      title: "CAS Received",
      date: null,
      status: editableFields.cas_received ? "completed" : "pending",
      icon: editableFields.cas_received ? CheckCircle2 : Clock,
      editable: true,
      field: "cas_received" as const,
      label: "CAS received",
    },
    {
      title: "Deposit Paid",
      date: null,
      status: editableFields.deposit_paid ? "completed" : "pending",
      icon: editableFields.deposit_paid ? CheckCircle2 : Clock,
      editable: true,
      field: "deposit_paid" as const,
      label: "Deposit paid",
    },
    {
      title: "Visa Application",
      date: application?.visa_application_date,
      status: application?.visa_status === "approved" ? "completed" : 
              application?.visa_status === "in_progress" ? "in-progress" : "pending",
      icon: application?.visa_status === "approved" ? CheckCircle2 : 
            application?.visa_status === "in_progress" ? AlertCircle : Clock,
      editable: false,
    },
    {
      title: "Visa Approval",
      date: application?.visa_approval_date,
      status: application?.visa_status === "approved" ? "completed" : "pending",
      icon: application?.visa_status === "approved" ? CheckCircle2 : Clock,
      editable: false,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Application Timeline
            </CardTitle>
            <CardDescription>Track your application journey milestones</CardDescription>
          </div>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Progress
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel} disabled={saving}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-1" />
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`rounded-full p-2 ${
                  milestone.status === "completed" 
                    ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400" 
                    : milestone.status === "in-progress"
                    ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
                    : "bg-muted text-muted-foreground"
                }`}>
                  <milestone.icon className="h-4 w-4" />
                </div>
                {index < milestones.length - 1 && (
                  <div className={`w-0.5 h-12 ${
                    milestone.status === "completed" 
                      ? "bg-green-200 dark:bg-green-900/40" 
                      : "bg-border"
                  }`} />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium text-sm">{milestone.title}</h4>
                    {isEditing && milestone.editable && milestone.field && (
                      <div className="flex items-center gap-2">
                        <Switch
                          id={milestone.field}
                          checked={editableFields[milestone.field]}
                          onCheckedChange={() => handleToggle(milestone.field)}
                        />
                        <Label htmlFor={milestone.field} className="text-xs text-muted-foreground sr-only">
                          {milestone.label}
                        </Label>
                      </div>
                    )}
                  </div>
                  <Badge variant={
                    milestone.status === "completed" ? "default" : 
                    milestone.status === "in-progress" ? "secondary" : "outline"
                  } className={`text-xs ${
                    milestone.status === "completed" 
                      ? "bg-green-500/10 text-green-600 border-green-500/20" 
                      : milestone.status === "in-progress"
                      ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                      : ""
                  }`}>
                    {milestone.status}
                  </Badge>
                </div>
                {(milestone.date || milestone.description) && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {milestone.date 
                      ? new Date(milestone.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : milestone.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
