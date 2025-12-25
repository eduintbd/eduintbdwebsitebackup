import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DocumentUpload } from "./DocumentUpload";

interface DocumentCenterProps {
  application: any;
  onUpdate?: () => void;
}

export function DocumentCenter({ application, onUpdate }: DocumentCenterProps) {
  const requiredDocuments = [
    {
      name: "Passport Copy",
      status: application.documents_uploaded ? "uploaded" : "pending",
      required: true,
    },
    {
      name: "Academic Transcripts",
      status: application.documents_uploaded ? "uploaded" : "pending",
      required: true,
    },
    {
      name: "English Test Scores (IELTS/TOEFL)",
      status: "pending",
      required: true,
    },
    {
      name: "Statement of Purpose",
      status: "pending",
      required: true,
    },
    {
      name: "Recommendation Letters",
      status: "pending",
      required: false,
    },
    {
      name: "Financial Documents",
      status: "pending",
      required: true,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploaded":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "under_review":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleDocumentsChange = () => {
    if (onUpdate) {
      onUpdate();
    }
  };

  return (
    <div className="space-y-6">
      {/* Document Upload Section */}
      <DocumentUpload
        userId={application.id}
        userEmail={application.email}
        documents={application.document_urls}
        onDocumentsChange={handleDocumentsChange}
      />

      {/* Document Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Required Documents Checklist
          </CardTitle>
          <CardDescription>Keep track of documents you need to submit</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {requiredDocuments.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getStatusIcon(doc.status)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{doc.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={doc.status === "uploaded" ? "default" : "outline"} className="text-xs">
                        {doc.status}
                      </Badge>
                      {doc.required && (
                        <Badge variant="secondary" className="text-xs">Required</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
