import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Clock, Target, TrendingUp, Calendar } from "lucide-react";
import { format } from "date-fns";

interface StudentIELTSProgressProps {
  studentEmail: string;
}

interface PracticeSession {
  id: string;
  module_id: string;
  started_at: string;
  completed_at: string | null;
  duration_seconds: number | null;
  total_questions: number;
  correct_answers: number;
  score_percentage: number | null;
  session_type: string | null;
}

interface ModuleStats {
  moduleType: string;
  totalSessions: number;
  avgScore: number;
  bestScore: number;
  totalTime: number;
}

const MODULE_LABELS: Record<string, string> = {
  reading: "Reading",
  writing: "Writing",
  listening: "Listening",
  speaking: "Speaking",
};

export function StudentIELTSProgress({ studentEmail }: StudentIELTSProgressProps) {
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [moduleStats, setModuleStats] = useState<ModuleStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadProgress();
  }, [studentEmail]);

  const loadProgress = async () => {
    setIsLoading(true);
    try {
      // First, find the user ID from profiles table using email
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

      // Fetch practice sessions for this user
      const { data: practiceData } = await supabase
        .from("practice_sessions")
        .select(`
          id,
          module_id,
          started_at,
          completed_at,
          duration_seconds,
          total_questions,
          correct_answers,
          score_percentage,
          session_type
        `)
        .eq("user_id", profile.id)
        .order("started_at", { ascending: false });

      if (practiceData) {
        setSessions(practiceData);
        calculateModuleStats(practiceData);
      }
    } catch (error) {
      console.error("Error loading IELTS progress:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateModuleStats = (data: PracticeSession[]) => {
    // Get modules to map module_id to module_type
    supabase
      .from("ielts_modules")
      .select("id, module_type")
      .then(({ data: modules }) => {
        if (!modules) return;

        const moduleMap = new Map(modules.map((m) => [m.id, m.module_type]));
        const statsMap = new Map<string, { scores: number[]; times: number[]; count: number }>();

        data.forEach((session) => {
          const moduleType = moduleMap.get(session.module_id) || "unknown";
          if (!statsMap.has(moduleType)) {
            statsMap.set(moduleType, { scores: [], times: [], count: 0 });
          }
          const stat = statsMap.get(moduleType)!;
          stat.count++;
          if (session.score_percentage) stat.scores.push(session.score_percentage);
          if (session.duration_seconds) stat.times.push(session.duration_seconds);
        });

        const stats: ModuleStats[] = [];
        statsMap.forEach((value, key) => {
          stats.push({
            moduleType: key,
            totalSessions: value.count,
            avgScore: value.scores.length > 0 
              ? Math.round(value.scores.reduce((a, b) => a + b, 0) / value.scores.length) 
              : 0,
            bestScore: value.scores.length > 0 ? Math.max(...value.scores) : 0,
            totalTime: Math.round(value.times.reduce((a, b) => a + b, 0) / 60),
          });
        });

        setModuleStats(stats);
      });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Loading IELTS progress...</p>
      </div>
    );
  }

  if (!userId || sessions.length === 0) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="py-8 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No IELTS practice sessions recorded yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Student hasn't started practicing or hasn't linked their account.
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalSessions = sessions.length;
  const completedSessions = sessions.filter((s) => s.completed_at).length;
  const avgScore = sessions.filter((s) => s.score_percentage)
    .reduce((acc, s) => acc + (s.score_percentage || 0), 0) / 
    (sessions.filter((s) => s.score_percentage).length || 1);
  const totalTime = Math.round(
    sessions.reduce((acc, s) => acc + (s.duration_seconds || 0), 0) / 60
  );

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-primary/10">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Total Sessions</span>
            </div>
            <p className="text-2xl font-bold">{totalSessions}</p>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <p className="text-2xl font-bold">{completedSessions}</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Avg Score</span>
            </div>
            <p className="text-2xl font-bold">{Math.round(avgScore)}%</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-500/10">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">Study Time</span>
            </div>
            <p className="text-2xl font-bold">{totalTime} min</p>
          </CardContent>
        </Card>
      </div>

      {/* Module Performance */}
      {moduleStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Module Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moduleStats.map((stat) => (
                <div key={stat.moduleType} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="capitalize">
                      {MODULE_LABELS[stat.moduleType] || stat.moduleType}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {stat.totalSessions} sessions
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span>Avg: <strong>{stat.avgScore}%</strong></span>
                    <span>Best: <strong>{stat.bestScore}%</strong></span>
                    <span className="text-muted-foreground">{stat.totalTime} min</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Practice Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sessions.slice(0, 10).map((session) => (
              <div 
                key={session.id} 
                className="flex items-center justify-between p-3 border border-border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {format(new Date(session.started_at), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.correct_answers}/{session.total_questions} correct
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {session.score_percentage && (
                    <Badge variant={session.score_percentage >= 70 ? "default" : "secondary"}>
                      {Math.round(session.score_percentage)}%
                    </Badge>
                  )}
                  {session.duration_seconds && (
                    <span className="text-xs text-muted-foreground">
                      {Math.round(session.duration_seconds / 60)} min
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
