import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { 
  Target, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  BookOpen,
  GraduationCap,
  FileText,
  Plane,
  Award,
  Languages
} from "lucide-react";
import { format, differenceInDays, isPast } from "date-fns";

interface StudentStudyPlannerProps {
  studentEmail: string;
}

interface StudyGoal {
  id: string;
  goal_type: string;
  description: string | null;
  target_value: number | null;
  target_date: string | null;
  status: string | null;
  module_type: string | null;
  created_at: string;
}

interface StudySchedule {
  id: string;
  scheduled_date: string;
  scheduled_time: string | null;
  duration_minutes: number | null;
  completed: boolean | null;
  notes: string | null;
}

const GOAL_ICONS: Record<string, any> = {
  target_score: Target,
  module_completion: BookOpen,
  daily_practice: Clock,
  exam_date: Calendar,
  ielts_score: GraduationCap,
  application_deadline: FileText,
  visa_preparation: Plane,
  scholarship_applications: Award,
  document_collection: FileText,
  language_practice: Languages,
};

const GOAL_LABELS: Record<string, string> = {
  target_score: "Target Score",
  module_completion: "Module Completion",
  daily_practice: "Daily Practice",
  exam_date: "Exam Date",
  ielts_score: "IELTS Score",
  application_deadline: "Application Deadline",
  visa_preparation: "Visa Preparation",
  scholarship_applications: "Scholarship Applications",
  document_collection: "Document Collection",
  language_practice: "Language Practice",
};

export function StudentStudyPlanner({ studentEmail }: StudentStudyPlannerProps) {
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [schedules, setSchedules] = useState<StudySchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadPlannerData();
  }, [studentEmail]);

  const loadPlannerData = async () => {
    setIsLoading(true);
    try {
      // Find user ID from profiles table
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", studentEmail)
        .maybeSingle();

      if (!profile) {
        setIsLoading(false);
        return;
      }

      setUserId(profile.id);

      // Fetch study goals
      const { data: goalsData } = await supabase
        .from("study_goals")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false });

      if (goalsData) {
        setGoals(goalsData);
      }

      // Fetch study schedules
      const { data: schedulesData } = await supabase
        .from("study_schedules")
        .select("*")
        .eq("user_id", profile.id)
        .order("scheduled_date", { ascending: true });

      if (schedulesData) {
        setSchedules(schedulesData);
      }
    } catch (error) {
      console.error("Error loading study planner:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Loading study planner...</p>
      </div>
    );
  }

  if (!userId || (goals.length === 0 && schedules.length === 0)) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="py-8 text-center">
          <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No study goals or schedules set yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Student hasn't started using the study planner.
          </p>
        </CardContent>
      </Card>
    );
  }

  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");
  const upcomingSchedules = schedules.filter((s) => !s.completed && !isPast(new Date(s.scheduled_date)));
  const completedSchedules = schedules.filter((s) => s.completed);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-primary/10">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Active Goals</span>
            </div>
            <p className="text-2xl font-bold">{activeGoals.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <p className="text-2xl font-bold">{completedGoals.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Upcoming</span>
            </div>
            <p className="text-2xl font-bold">{upcomingSchedules.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-500/10">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">Tasks Done</span>
            </div>
            <p className="text-2xl font-bold">{completedSchedules.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Active Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeGoals.map((goal) => {
                const Icon = GOAL_ICONS[goal.goal_type] || Target;
                const daysRemaining = goal.target_date 
                  ? differenceInDays(new Date(goal.target_date), new Date())
                  : null;
                const progress = daysRemaining !== null && goal.target_date
                  ? Math.max(0, Math.min(100, 100 - (daysRemaining / 30) * 100))
                  : 0;

                return (
                  <div key={goal.id} className="p-4 border border-border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {GOAL_LABELS[goal.goal_type] || goal.goal_type}
                          </p>
                          {goal.description && (
                            <p className="text-sm text-muted-foreground">{goal.description}</p>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      {goal.target_value && (
                        <span>
                          Target: <strong>{goal.target_value}</strong>
                        </span>
                      )}
                      {goal.target_date && (
                        <span className="text-muted-foreground">
                          Due: {format(new Date(goal.target_date), "MMM d, yyyy")}
                        </span>
                      )}
                      {daysRemaining !== null && daysRemaining >= 0 && (
                        <Badge variant={daysRemaining <= 7 ? "destructive" : "secondary"}>
                          {daysRemaining} days left
                        </Badge>
                      )}
                    </div>

                    {daysRemaining !== null && (
                      <Progress value={progress} className="h-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Completed Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedGoals.map((goal) => {
                const Icon = GOAL_ICONS[goal.goal_type] || Target;
                return (
                  <div key={goal.id} className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-green-500" />
                      <span className="font-medium">{GOAL_LABELS[goal.goal_type] || goal.goal_type}</span>
                    </div>
                    <Badge variant="default" className="bg-green-500">Completed</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Schedules */}
      {upcomingSchedules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Upcoming Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingSchedules.slice(0, 10).map((schedule) => (
                <div 
                  key={schedule.id} 
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {format(new Date(schedule.scheduled_date), "EEEE, MMM d, yyyy")}
                      </p>
                      {schedule.scheduled_time && (
                        <p className="text-sm text-muted-foreground">
                          at {schedule.scheduled_time}
                        </p>
                      )}
                      {schedule.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{schedule.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {schedule.duration_minutes && (
                      <Badge variant="outline">{schedule.duration_minutes} min</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
