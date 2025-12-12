import { useState } from "react";
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

export function ApplicationTimeline() {
  const [steps] = useState<TimelineStep[]>([
    {
      id: "1",
      title: "Research & Planning",
      description: "Explore countries, universities, and programs",
      status: "completed",
      icon: GraduationCap,
      date: "Completed",
    },
    {
      id: "2",
      title: "Standardized Tests",
      description: "IELTS, TOEFL, GRE, GMAT preparation and exams",
      status: "completed",
      icon: FileText,
      date: "Completed",
    },
    {
      id: "3",
      title: "Document Preparation",
      description: "Gather transcripts, LORs, SOP, and other documents",
      status: "current",
      icon: FileText,
      date: "In Progress",
    },
    {
      id: "4",
      title: "University Applications",
      description: "Submit applications to selected universities",
      status: "upcoming",
      icon: Award,
      date: "Jan 2025",
    },
    {
      id: "5",
      title: "Scholarship Applications",
      description: "Apply for available scholarships and financial aid",
      status: "upcoming",
      icon: DollarSign,
      date: "Feb 2025",
    },
    {
      id: "6",
      title: "Admission & Offer",
      description: "Receive and accept university offer letters",
      status: "upcoming",
      icon: MessageSquare,
      date: "Mar 2025",
    },
    {
      id: "7",
      title: "Visa Application",
      description: "Apply for student visa with required documents",
      status: "upcoming",
      icon: FileText,
      date: "Apr 2025",
    },
    {
      id: "8",
      title: "Pre-Departure",
      description: "Arrange accommodation, travel, and finances",
      status: "upcoming",
      icon: Home,
      date: "Aug 2025",
    },
    {
      id: "9",
      title: "Travel & Arrival",
      description: "Travel to destination and start your journey",
      status: "upcoming",
      icon: Plane,
      date: "Sep 2025",
    },
  ]);

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

  const getStatusColor = (status: TimelineStep["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "current":
        return "bg-primary";
      default:
        return "bg-muted";
    }
  };

  const completedSteps = steps.filter(s => s.status === "completed").length;
  const progress = (completedSteps / steps.length) * 100;

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
