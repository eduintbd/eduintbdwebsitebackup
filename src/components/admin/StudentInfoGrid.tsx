import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, Calendar, GraduationCap, MapPin, User, AlertCircle, Clock } from "lucide-react";

interface StudentInfoGridProps {
  student: any;
  editMode?: boolean;
  editedStudent?: any;
  setEditedStudent?: (student: any) => void;
}

export function StudentInfoGrid({ student, editMode = false, editedStudent, setEditedStudent }: StudentInfoGridProps) {
  // Define which fields to show in each row (configurable)
  const row1Fields = [
    {
      label: "Name",
      value: student.name,
      icon: User,
      fullWidth: false,
      editable: true,
      fieldName: "name",
      fieldType: "input"
    },
    {
      label: "Email",
      value: student.email,
      icon: Mail,
      fullWidth: false,
      editable: false
    },
    {
      label: "Phone",
      value: student.phone,
      icon: Phone,
      fullWidth: false,
      editable: true,
      fieldName: "phone",
      fieldType: "input"
    },
    {
      label: "Priority",
      value: student.priority_level || "medium",
      icon: AlertCircle,
      fullWidth: false,
      badge: true,
      editable: true,
      fieldName: "priority_level",
      fieldType: "select",
      options: [
        { value: "urgent", label: "Urgent" },
        { value: "high", label: "High" },
        { value: "medium", label: "Medium" },
        { value: "low", label: "Low" }
      ]
    }
  ];

  const row2Fields = [
    {
      label: "Study Destination",
      value: student.study_destination || "Not specified",
      icon: MapPin,
      fullWidth: false,
      editable: true,
      fieldName: "study_destination",
      fieldType: "input"
    },
    {
      label: "Study Year",
      value: student.study_year || "Not specified",
      icon: GraduationCap,
      fullWidth: false,
      editable: true,
      fieldName: "study_year",
      fieldType: "input"
    },
    {
      label: "Counselor",
      value: student.assigned_counselor || "Not assigned",
      icon: User,
      fullWidth: false,
      editable: true,
      fieldName: "assigned_counselor",
      fieldType: "input"
    },
    {
      label: "Application Date",
      value: new Date(student.created_at).toLocaleDateString(),
      icon: Clock,
      fullWidth: false,
      editable: false
    }
  ];

  const row3Fields = [
    {
      label: "Application Status",
      value: student.application_status || "initial_inquiry",
      icon: GraduationCap,
      fullWidth: false,
      badge: true,
      editable: true,
      fieldName: "application_status",
      fieldType: "select",
      options: [
        { value: "initial_inquiry", label: "Initial Inquiry" },
        { value: "consultation", label: "Consultation" },
        { value: "document_collection", label: "Document Collection" },
        { value: "application_preparation", label: "Application Preparation" },
        { value: "applied_submission", label: "Applied / Submission" },
        { value: "follow_ups_communication", label: "Follow-ups and Communication" },
        { value: "offer_received", label: "Offer Received" },
        { value: "visa_assistance", label: "Visa Assistance" },
        { value: "acceptance", label: "Acceptance" },
        { value: "enrollment", label: "Enrollment" },
        { value: "long_term_nurture", label: "Long-Term Nurture" },
        { value: "lost", label: "Lost" }
      ]
    },
    {
      label: "Visa Status",
      value: student.visa_status || "not_started",
      icon: MapPin,
      fullWidth: false,
      badge: true,
      editable: true,
      fieldName: "visa_status",
      fieldType: "select",
      options: [
        { value: "not_started", label: "Not Started" },
        { value: "preparing", label: "Preparing" },
        { value: "submitted", label: "Submitted" },
        { value: "approved", label: "Approved" },
        { value: "rejected", label: "Rejected" }
      ]
    },
    {
      label: "Consultation",
      value: student.consultation_completed ? "Completed" : "Pending",
      icon: Calendar,
      fullWidth: false,
      badge: true,
      variant: student.consultation_completed ? "default" : "outline",
      editable: false
    },
    {
      label: "Session Date",
      value: student.session_date 
        ? new Date(student.session_date).toLocaleDateString()
        : "Not scheduled",
      icon: Calendar,
      fullWidth: false,
      editable: false
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "default";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "secondary";
    }
  };

  const renderField = (field: any) => {
    const Icon = field.icon;
    
    return (
      <div key={field.label} className="flex flex-col space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
          <span className="font-medium">{field.label}</span>
        </div>
        <div className="text-sm font-medium">
          {editMode && field.editable && editedStudent && setEditedStudent ? (
            <>
              {field.fieldType === "select" ? (
                <Select
                  value={editedStudent[field.fieldName] || field.value}
                  onValueChange={(value) => setEditedStudent({ ...editedStudent, [field.fieldName]: value })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option: any) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={editedStudent[field.fieldName] || ""}
                  onChange={(e) => setEditedStudent({ ...editedStudent, [field.fieldName]: e.target.value })}
                  className="h-8 text-xs"
                  placeholder={field.label}
                />
              )}
            </>
          ) : field.badge ? (
            <Badge 
              variant={
                field.label === "Priority" 
                  ? getPriorityColor(field.value)
                  : field.variant || "outline"
              }
              className="text-xs"
            >
              {field.value}
            </Badge>
          ) : (
            <span className="text-foreground">{field.value}</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="border-2 shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-4 gap-6 pb-4 border-b">
            {row1Fields.map(renderField)}
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-4 gap-6 pb-4 border-b">
            {row2Fields.map(renderField)}
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-4 gap-6">
            {row3Fields.map(renderField)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
