import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CommunicationCenter } from "@/components/portal/CommunicationCenter";
import { StudentActivityTimeline } from "@/components/admin/StudentActivityTimeline";
import { StudentCustomFields } from "@/components/admin/StudentCustomFields";

interface StudentCommunicationPanelProps {
  student: {
    id: string;
    email: string;
    phone: string;
    name: string;
  };
}

export function StudentCommunicationPanel({ student }: StudentCommunicationPanelProps) {
  return (
    <div className="space-y-6">
      {/* Activity Timeline */}
      <StudentActivityTimeline 
        studentId={student.id}
      />

      {/* Communication Center */}
      <CommunicationCenter
        studentId={student.id}
        studentEmail={student.email}
        studentPhone={student.phone}
        studentName={student.name}
        isAdmin={true}
      />
    </div>
  );
}