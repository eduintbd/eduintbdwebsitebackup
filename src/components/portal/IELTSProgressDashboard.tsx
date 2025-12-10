import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  BookOpen, 
  PenTool, 
  Headphones, 
  Mic, 
  TrendingUp, 
  Target,
  Clock,
  Award,
  BarChart3,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";

interface ModuleStats {
  module_type: string;
  total_sessions: number;
  avg_score: number;
  best_score: number;
  total_time_minutes: number;
  last_practice: string | null;
}

interface OverallStats {
  total_sessions: number;
  total_study_time: number;
  overall_avg_score: number;
  streak_days: number;
}

const MODULE_CONFIG = {
  reading: { 
    icon: BookOpen, 
    label: "Reading", 
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    link: "/ielts/reading"
  },
  writing: { 
    icon: PenTool, 
    label: "Writing", 
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    link: "/ielts/writing"
  },
  listening: { 
    icon: Headphones, 
    label: "Listening", 
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    link: "/ielts/listening"
  },
  speaking: { 
    icon: Mic, 
    label: "Speaking", 
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    link: "/ielts/speaking"
  },
};

export function IELTSProgressDashboard() {
  const [moduleStats, setModuleStats] = useState<ModuleStats[]>([]);
  const [overallStats, setOverallStats] = useState<OverallStats>({
    total_sessions: 0,
    total_study_time: 0,
    overall_avg_score: 0,
    streak_days: 0,
  });
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Fetch all completed practice sessions
      const { data: sessions, error } = await supabase
        .from("practice_sessions")
        .select(`
          *,
          ielts_modules (
            module_type,
            title
          )
        `)
        .eq("user_id", user.id)
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: false });

      if (error) throw error;

      // Calculate module-specific stats
      const moduleMap: Record<string, ModuleStats> = {};
      let totalScore = 0;
      let totalTime = 0;
      let scoreCount = 0;

      sessions?.forEach((session) => {
        const moduleType = session.ielts_modules?.module_type || 
          (session.metadata as any)?.module_type || "unknown";
        
        if (!moduleMap[moduleType]) {
          moduleMap[moduleType] = {
            module_type: moduleType,
            total_sessions: 0,
            avg_score: 0,
            best_score: 0,
            total_time_minutes: 0,
            last_practice: null,
          };
        }

        const stats = moduleMap[moduleType];
        stats.total_sessions += 1;
        
        if (session.score_percentage !== null) {
          stats.avg_score = (stats.avg_score * (stats.total_sessions - 1) + session.score_percentage) / stats.total_sessions;
          stats.best_score = Math.max(stats.best_score, session.score_percentage);
          totalScore += session.score_percentage;
          scoreCount++;
        }

        if (session.duration_seconds) {
          stats.total_time_minutes += Math.round(session.duration_seconds / 60);
          totalTime += session.duration_seconds;
        }

        if (!stats.last_practice || new Date(session.completed_at) > new Date(stats.last_practice)) {
          stats.last_practice = session.completed_at;
        }
      });

      setModuleStats(Object.values(moduleMap));
      setRecentSessions(sessions?.slice(0, 5) || []);

      // Calculate streak
      let streak = 0;
      if (sessions && sessions.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const practiceDays = new Set(
          sessions.map(s => {
            const d = new Date(s.completed_at);
            return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
          })
        );

        for (let i = 0; i < 30; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(checkDate.getDate() - i);
          const key = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
          if (practiceDays.has(key)) {
            streak++;
          } else if (i > 0) {
            break;
          }
        }
      }

      setOverallStats({
        total_sessions: sessions?.length || 0,
        total_study_time: Math.round(totalTime / 60),
        overall_avg_score: scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0,
        streak_days: streak,
      });

    } catch (error) {
      console.error("Error loading progress:", error);
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

  const hasProgress = overallStats.total_sessions > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            IELTS Practice Progress
          </CardTitle>
          <CardDescription>Track your performance across all IELTS modules</CardDescription>
        </CardHeader>
        <CardContent>
          {hasProgress ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-background rounded-lg">
                <Target className="h-6 w-6 mx-auto mb-1 text-primary" />
                <p className="text-2xl font-bold">{overallStats.total_sessions}</p>
                <p className="text-xs text-muted-foreground">Total Sessions</p>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <TrendingUp className="h-6 w-6 mx-auto mb-1 text-green-500" />
                <p className="text-2xl font-bold">{overallStats.overall_avg_score}%</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <Clock className="h-6 w-6 mx-auto mb-1 text-blue-500" />
                <p className="text-2xl font-bold">{overallStats.total_study_time}</p>
                <p className="text-xs text-muted-foreground">Minutes Studied</p>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <Award className="h-6 w-6 mx-auto mb-1 text-orange-500" />
                <p className="text-2xl font-bold">{overallStats.streak_days}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">
                Start practicing to see your progress here!
              </p>
              <Button asChild>
                <Link to="/ielts-learning">Start Practicing</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Module Progress */}
      {hasProgress && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Module Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {["reading", "writing", "listening", "speaking"].map((moduleType) => {
              const config = MODULE_CONFIG[moduleType as keyof typeof MODULE_CONFIG];
              const stats = moduleStats.find(s => s.module_type === moduleType);
              const Icon = config.icon;

              return (
                <div key={moduleType} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${config.bgColor}`}>
                        <Icon className={`h-4 w-4 ${config.color}`} />
                      </div>
                      <span className="font-medium">{config.label}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      {stats ? (
                        <>
                          <Badge variant="secondary">{stats.total_sessions} sessions</Badge>
                          <span className="font-semibold">{Math.round(stats.avg_score)}%</span>
                        </>
                      ) : (
                        <Badge variant="outline">Not started</Badge>
                      )}
                    </div>
                  </div>
                  <Progress 
                    value={stats?.avg_score || 0} 
                    className="h-2"
                  />
                  {stats && stats.total_sessions > 0 && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Best: {Math.round(stats.best_score)}%</span>
                      <span>{stats.total_time_minutes} min total</span>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {recentSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSessions.map((session) => {
                const moduleType = session.ielts_modules?.module_type || 
                  (session.metadata as any)?.module_type || "unknown";
                const config = MODULE_CONFIG[moduleType as keyof typeof MODULE_CONFIG] || MODULE_CONFIG.reading;
                const Icon = config.icon;
                const date = new Date(session.completed_at);

                return (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${config.bgColor}`}>
                        <Icon className={`h-4 w-4 ${config.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{config.label} Practice</p>
                        <p className="text-xs text-muted-foreground">
                          {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {session.score_percentage !== null ? `${Math.round(session.score_percentage)}%` : '-'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.correct_answers}/{session.total_questions} correct
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Practice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(MODULE_CONFIG).map(([type, config]) => {
              const Icon = config.icon;
              return (
                <Button 
                  key={type} 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col gap-2"
                  asChild
                >
                  <Link to={config.link}>
                    <Icon className={`h-6 w-6 ${config.color}`} />
                    <span className="text-sm">{config.label}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
