import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Download, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface DocumentCenterProps {
  application: any;
}

export function DocumentCenter({ application }: DocumentCenterProps) {
  const { toast } = useToast();

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

  const handleUpload = () => {
    toast({
      title: "Upload Feature",
      description: "Document upload functionality will be available soon. Please contact your advisor.",
    });
  };

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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Center
            </CardTitle>
            <CardDescription>Upload and manage your application documents</CardDescription>
          </div>
          <Button onClick={handleUpload} size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
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
              {doc.status === "uploaded" && (
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-muted/50 border-2 border-dashed border-border">
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-1">Drag and drop files here</p>
            <p className="text-xs text-muted-foreground mb-3">or click to browse</p>
            <Button onClick={handleUpload} variant="outline" size="sm">
              Choose Files
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
