import { DocumentUpload } from "./DocumentUpload";

interface DocumentCenterProps {
  application: any;
  onUpdate?: () => void;
}

export function DocumentCenter({ application, onUpdate }: DocumentCenterProps) {
  const handleDocumentsChange = () => {
    onUpdate?.();
  };

  return (
    <div className="space-y-6">
      <DocumentUpload
        userId={application.id}
        userEmail={application.email}
        documents={application.document_urls}
        onDocumentsChange={handleDocumentsChange}
      />
    </div>
  );
}
