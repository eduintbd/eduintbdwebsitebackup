import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TimelineViewProps {
  application: any;
}

export function TimelineView({ application }: TimelineViewProps) {
  const milestones = [
    {
      title: "Application Submitted",
      date: application.created_at,
      status: "completed",
      icon: CheckCircle2,
    },
    {
      title: "Initial Consultation",
      date: application.session_date,
      status: application.consultation_completed ? "completed" : "pending",
      icon: application.consultation_completed ? CheckCircle2 : Clock,
    },
    {
      title: "Document Submission",
      date: null,
      status: application.documents_uploaded ? "completed" : "pending",
      icon: application.documents_uploaded ? CheckCircle2 : Clock,
    },
    {
      title: "Offer Letter",
      date: null,
      status: application.offer_letter_received ? "completed" : "pending",
      icon: application.offer_letter_received ? CheckCircle2 : Clock,
    },
    {
      title: "Visa Application",
      date: application.visa_application_date,
      status: application.visa_status === "approved" ? "completed" : 
              application.visa_status === "in_progress" ? "in-progress" : "pending",
      icon: application.visa_status === "approved" ? CheckCircle2 : 
            application.visa_status === "in_progress" ? AlertCircle : Clock,
    },
    {
      title: "Visa Approval",
      date: application.visa_approval_date,
      status: application.visa_status === "approved" ? "completed" : "pending",
      icon: application.visa_status === "approved" ? CheckCircle2 : Clock,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Application Timeline
        </CardTitle>
        <CardDescription>Track your application journey milestones</CardDescription>
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
                  <h4 className="font-medium text-sm">{milestone.title}</h4>
                  <Badge variant={
                    milestone.status === "completed" ? "default" : 
                    milestone.status === "in-progress" ? "secondary" : "outline"
                  } className="text-xs">
                    {milestone.status}
                  </Badge>
                </div>
                {milestone.date && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(milestone.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
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
