import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, Circle, Clock, FileText, GraduationCap, 
  Plane, Home, DollarSign, Award, MessageSquare
} from "lucide-react";

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "current" | "upcoming";
  icon: any;
  date?: string;
}

interface ApplicationTimelineProps {
  application?: any;
}

export function ApplicationTimeline({ application }: ApplicationTimelineProps) {
  const [steps, setSteps] = useState<TimelineStep[]>([]);

  useEffect(() => {
    // Build timeline based on actual application data
    const buildTimeline = (): TimelineStep[] => {
      const timelineSteps: TimelineStep[] = [];
      
      // Step 1: Research & Planning - completed if application exists
      const hasApplication = !!application;
      timelineSteps.push({
        id: "1",
        title: "Research & Planning",
        description: "Explore countries, universities, and programs",
        status: hasApplication ? "completed" : "upcoming",
        icon: GraduationCap,
        date: hasApplication ? "Completed" : "Pending",
      });

      // Step 2: Standardized Tests - based on actual IELTS completion or consultation
      const hasConsultation = application?.consultation_completed;
      timelineSteps.push({
        id: "2",
        title: "Standardized Tests",
        description: "IELTS, TOEFL, GRE, GMAT preparation and exams",
        status: hasConsultation ? "completed" : hasApplication ? "current" : "upcoming",
        icon: FileText,
        date: hasConsultation ? "Completed" : hasApplication ? "In Progress" : "Pending",
      });

      // Step 3: Document Preparation - based on documents_uploaded
      const hasDocuments = application?.documents_uploaded;
      timelineSteps.push({
        id: "3",
        title: "Document Preparation",
        description: "Gather transcripts, LORs, SOP, and other documents",
        status: hasDocuments ? "completed" : hasConsultation ? "current" : "upcoming",
        icon: FileText,
        date: hasDocuments ? "Completed" : hasConsultation ? "In Progress" : "Pending",
      });

      // Step 4: University Applications - based on application_status
      const hasApplied = application?.application_status && 
        !['initial_inquiry', 'consultation'].includes(application.application_status);
      timelineSteps.push({
        id: "4",
        title: "University Applications",
        description: "Submit applications to selected universities",
        status: hasApplied ? "completed" : hasDocuments ? "current" : "upcoming",
        icon: Award,
        date: hasApplied ? "Completed" : hasDocuments ? "In Progress" : "Pending",
      });

      // Step 5: Scholarship Applications
      const hasScholarship = application?.scholarship_amount && application.scholarship_amount > 0;
      timelineSteps.push({
        id: "5",
        title: "Scholarship Applications",
        description: "Apply for available scholarships and financial aid",
        status: hasScholarship ? "completed" : hasApplied ? "current" : "upcoming",
        icon: DollarSign,
        date: hasScholarship ? "Completed" : hasApplied ? "In Progress" : "Pending",
      });

      // Step 6: Admission & Offer - based on offer_letter_received
      const hasOffer = application?.offer_letter_received;
      timelineSteps.push({
        id: "6",
        title: "Admission & Offer",
        description: "Receive and accept university offer letters",
        status: hasOffer ? "completed" : hasApplied ? "current" : "upcoming",
        icon: MessageSquare,
        date: hasOffer ? "Completed" : hasApplied ? "In Progress" : "Pending",
      });

      // Step 7: Visa Application - based on visa_status
      const visaApplied = application?.visa_status && application.visa_status !== 'not_started';
      const visaApproved = application?.visa_status === 'approved';
      timelineSteps.push({
        id: "7",
        title: "Visa Application",
        description: "Apply for student visa with required documents",
        status: visaApproved ? "completed" : visaApplied ? "current" : "upcoming",
        icon: FileText,
        date: visaApproved ? "Approved" : visaApplied ? "In Progress" : "Pending",
      });

      // Step 8: Pre-Departure - based on CAS received and deposit paid
      const preDepartureReady = application?.cas_received && application?.deposit_paid;
      timelineSteps.push({
        id: "8",
        title: "Pre-Departure",
        description: "Arrange accommodation, travel, and finances",
        status: preDepartureReady ? "completed" : visaApproved ? "current" : "upcoming",
        icon: Home,
        date: preDepartureReady ? "Completed" : visaApproved ? "In Progress" : "Pending",
      });

      // Step 9: Travel & Arrival
      timelineSteps.push({
        id: "9",
        title: "Travel & Arrival",
        description: "Travel to destination and start your journey",
        status: preDepartureReady ? "current" : "upcoming",
        icon: Plane,
        date: preDepartureReady ? "Ready" : "Pending",
      });

      return timelineSteps;
    };

    setSteps(buildTimeline());
  }, [application]);

  const getStatusIcon = (status: TimelineStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-6 h-6 text-green-600" />;
      case "current":
        return <Clock className="w-6 h-6 text-primary animate-pulse" />;
      default:
        return <Circle className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const completedSteps = steps.filter(s => s.status === "completed").length;

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Application Progress</span>
        <Badge variant="secondary">{completedSteps}/{steps.length} steps completed</Badge>
      </div>

      {/* Timeline */}
      <div className="relative">
        {steps.map((step, index) => (
          <div key={step.id} className="flex gap-4 pb-6 last:pb-0">
            {/* Vertical Line */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                step.status === "completed" ? "bg-green-500/10 border-green-500" :
                step.status === "current" ? "bg-primary/10 border-primary" :
                "bg-muted border-muted-foreground/30"
              }`}>
                {getStatusIcon(step.status)}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-0.5 flex-1 mt-2 ${
                  step.status === "completed" ? "bg-green-500" : "bg-muted"
                }`} />
              )}
            </div>

            {/* Content */}
            <div className={`flex-1 pb-4 ${step.status === "upcoming" ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className={`font-semibold ${step.status === "current" ? "text-primary" : ""}`}>
                    {step.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                </div>
                <Badge 
                  variant={step.status === "completed" ? "default" : "outline"}
                  className={
                    step.status === "completed" ? "bg-green-500/10 text-green-600 border-green-500/20" :
                    step.status === "current" ? "bg-primary/10 text-primary border-primary/20" :
                    ""
                  }
                >
                  {step.date}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
