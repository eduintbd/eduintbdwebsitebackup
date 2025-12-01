import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ProgressAnalyticsProps {
  application: any;
}

export function ProgressAnalytics({ application }: ProgressAnalyticsProps) {
  const completedSteps = [
    application.consultation_completed,
    application.documents_uploaded,
    application.offer_letter_received,
    application.visa_status === "approved",
  ].filter(Boolean).length;

  const totalSteps = 4;
  const completionPercentage = Math.round((completedSteps / totalSteps) * 100);

  const missingDocuments = [
    !application.documents_uploaded && "Documents not uploaded",
    !application.offer_letter_received && "Offer letter pending",
    application.visa_status !== "approved" && "Visa not approved",
  ].filter(Boolean);

  const requiredActions = [
    !application.consultation_completed && { 
      action: "Schedule initial consultation", 
      priority: "high",
      icon: AlertCircle 
    },
    !application.documents_uploaded && { 
      action: "Upload required documents", 
      priority: "high",
      icon: AlertCircle 
    },
    !application.session_date && { 
      action: "Book consultation session", 
      priority: "medium",
      icon: Clock 
    },
  ].filter(Boolean);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Progress Analytics
        </CardTitle>
        <CardDescription>Overview of your application completion</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Completion</span>
            <span className="text-2xl font-bold text-primary">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-3" />
          <p className="text-xs text-muted-foreground mt-2">
            {completedSteps} of {totalSteps} major milestones completed
          </p>
        </div>

        {/* Missing Documents */}
        {missingDocuments.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              Missing Items
            </h4>
            <div className="space-y-2">
              {missingDocuments.map((doc, index) => (
                <div key={index} className="flex items-center gap-2 text-sm p-2 rounded bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30">
                  <div className="h-1.5 w-1.5 rounded-full bg-yellow-600" />
                  <span className="text-yellow-900 dark:text-yellow-100">{doc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Required Actions */}
        {requiredActions.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Required Actions
            </h4>
            <div className="space-y-2">
              {requiredActions.map((item: any, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-2 flex-1">
                    <item.icon className={`h-4 w-4 ${
                      item.priority === "high" ? "text-red-600" : "text-yellow-600"
                    }`} />
                    <span className="text-sm">{item.action}</span>
                  </div>
                  <Badge variant={item.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                    {item.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success State */}
        {completionPercentage === 100 && (
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30">
            <div className="flex items-center gap-2 text-green-900 dark:text-green-100">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="font-semibold">All milestones completed!</span>
            </div>
            <p className="text-sm text-green-800 dark:text-green-200 mt-1">
              Great job! Your application is progressing smoothly.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
