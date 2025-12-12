import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  Target, 
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  Loader2,
  MapPin,
  GraduationCap,
  FileText,
  Plane
} from "lucide-react";
import { Link } from "react-router-dom";
import { format, differenceInDays } from "date-fns";

interface StudyGoal {
  id: string;
  goal_type: string;
  description: string | null;
  target_value: number | null;
  target_date: string | null;
  status: string;
  module_type: string | null;
}

interface StudySchedule {
  id: string;
  scheduled_date: string;
  scheduled_time: string | null;
  duration_minutes: number | null;
  completed: boolean;
  notes: string | null;
}

const GOAL_ICONS: Record<string, any> = {
  target_score: Target,
  ielts_score: GraduationCap,
  application_deadline: FileText,
  visa_preparation: Plane,
  scholarship_applications: TrendingUp,
  document_collection: FileText,
  language_practice: GraduationCap,
};

const GOAL_LABELS: Record<string, string> = {
  target_score: "Target Score",
  ielts_score: "IELTS Score",
  application_deadline: "Application Deadline",
  visa_preparation: "Visa Preparation",
  scholarship_applications: "Scholarship Applications",
  document_collection: "Document Collection",
  language_practice: "Language Practice",
};

export function StudyPlannerSummary() {
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [schedules, setSchedules] = useState<StudySchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Fetch study goals
      const { data: goalsData, error: goalsError } = await supabase
        .from("study_goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (goalsError) throw goalsError;
      setGoals(goalsData || []);

      // Fetch study schedules
      const { data: schedulesData, error: schedulesError } = await supabase
        .from("study_schedules")
        .select("*")
        .eq("user_id", user.id)
        .gte("scheduled_date", new Date().toISOString().split('T')[0])
        .order("scheduled_date", { ascending: true })
        .limit(5);

      if (schedulesError) throw schedulesError;
      setSchedules(schedulesData || []);

    } catch (error) {
      console.error("Error loading study planner data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const activeGoals = goals.filter(g => g.status === "active");
  const completedGoals = goals.filter(g => g.status === "completed");
  const upcomingSchedules = schedules.filter(s => !s.completed);
  const completedSchedules = schedules.filter(s => s.completed);
  const hasData = goals.length > 0 || schedules.length > 0;

  // Calculate overall progress
  const totalGoals = goals.length;
  const overallProgress = totalGoals > 0 ? Math.round((completedGoals.length / totalGoals) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Study Planner Overview
          </CardTitle>
          <CardDescription>Track your study abroad goals and schedule</CardDescription>
        </CardHeader>
        <CardContent>
          {hasData ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-background rounded-lg">
                <Target className="h-6 w-6 mx-auto mb-1 text-primary" />
                <p className="text-2xl font-bold">{activeGoals.length}</p>
                <p className="text-xs text-muted-foreground">Active Goals</p>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <CheckCircle2 className="h-6 w-6 mx-auto mb-1 text-green-500" />
                <p className="text-2xl font-bold">{completedGoals.length}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <Calendar className="h-6 w-6 mx-auto mb-1 text-blue-500" />
                <p className="text-2xl font-bold">{upcomingSchedules.length}</p>
                <p className="text-xs text-muted-foreground">Upcoming Tasks</p>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <TrendingUp className="h-6 w-6 mx-auto mb-1 text-orange-500" />
                <p className="text-2xl font-bold">{overallProgress}%</p>
                <p className="text-xs text-muted-foreground">Progress</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">
                Set up your study goals and schedule to track your journey!
              </p>
              <Button asChild>
                <Link to="/study-planner">Go to Study Planner</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeGoals.slice(0, 4).map((goal) => {
              const Icon = GOAL_ICONS[goal.goal_type] || Target;
              const daysRemaining = goal.target_date 
                ? differenceInDays(new Date(goal.target_date), new Date())
                : null;

              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <span className="font-medium">{GOAL_LABELS[goal.goal_type] || goal.goal_type}</span>
                        {goal.description && (
                          <p className="text-xs text-muted-foreground">{goal.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {goal.target_value && (
                        <Badge variant="secondary">Target: {goal.target_value}</Badge>
                      )}
                      {daysRemaining !== null && daysRemaining >= 0 && (
                        <Badge variant={daysRemaining <= 7 ? "destructive" : "outline"}>
                          {daysRemaining} days left
                        </Badge>
                      )}
                    </div>
                  </div>
                  {goal.target_date && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Due: {format(new Date(goal.target_date), "MMM d, yyyy")}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Upcoming Schedule */}
      {upcomingSchedules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingSchedules.map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Calendar className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {schedule.notes || "Study Session"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(schedule.scheduled_date), "MMM d, yyyy")}
                        {schedule.scheduled_time && ` at ${schedule.scheduled_time}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {schedule.duration_minutes && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {schedule.duration_minutes} min
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
              <Link to="/study-planner">
                <Target className="h-6 w-6 text-primary" />
                <span className="text-sm">Manage Goals</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
              <Link to="/study-planner">
                <Calendar className="h-6 w-6 text-blue-500" />
                <span className="text-sm">View Schedule</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
