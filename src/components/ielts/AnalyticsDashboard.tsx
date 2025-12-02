import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { TrendingUp, Clock, Target, Flame, BookOpen, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PerformanceData {
  total_sessions: number;
  avg_score: number;
  best_score: number;
  total_study_time_seconds: number;
  active_days: number;
  days_since_last_practice: number;
  unique_modules_attempted: number;
  total_questions_attempted: number;
}

interface WeeklyData {
  week_start: string;
  sessions_count: number;
  avg_score: number;
  total_time_minutes: number;
  modules_completed: number;
}

interface ModulePerformance {
  module_type: string;
  attempts: number;
  avg_score: number;
  best_score: number;
}

export function AnalyticsDashboard({ userId }: { userId: string }) {
  const [performance, setPerformance] = useState<PerformanceData | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [modulePerformance, setModulePerformance] = useState<ModulePerformance[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [userId]);

  const fetchAnalytics = async () => {
    try {
      // Fetch overall performance
      const { data: perfData } = await supabase
        .from('user_performance_analytics')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Fetch weekly progress using RPC
      const { data: weeklyData } = await supabase
        .rpc('get_weekly_progress', { p_user_id: userId });

      // Fetch module performance
      const { data: moduleData } = await supabase
        .from('module_performance_by_type')
        .select('*')
        .eq('user_id', userId);

      // Calculate streak using RPC
      const { data: streakData } = await supabase
        .rpc('calculate_study_streak', { p_user_id: userId });

      setPerformance(perfData);
      setWeeklyData(weeklyData || []);
      setModulePerformance(moduleData || []);
      setStreak(streakData || 0);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds) return "0h 0m";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getModuleIcon = (type: string) => {
    const icons = {
      reading: "📖",
      writing: "✍️",
      listening: "🎧",
      speaking: "🗣️"
    };
    return icons[type as keyof typeof icons] || "📚";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!performance || performance.total_sessions === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Practice Data Yet</h3>
          <p className="text-muted-foreground">
            Complete some practice modules to see your analytics and progress trends!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{performance.total_sessions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {performance.unique_modules_attempted} unique modules
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{performance.avg_score?.toFixed(1) || 0}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Best: {performance.best_score?.toFixed(1) || 0}%
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Study Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatTime(performance.total_study_time_seconds || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {performance.active_days} active days
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2">
              {streak} <span className="text-2xl">🔥</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {performance.days_since_last_practice === 0 ? "Practiced today!" : 
               `${Math.floor(performance.days_since_last_practice)} days since last`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress Chart */}
      {weeklyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              12-Week Progress Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="week_start" 
                  tick={{ fill: 'currentColor' }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis tick={{ fill: 'currentColor' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return `Week of ${date.toLocaleDateString()}`;
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="avg_score" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Avg Score %" 
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sessions_count" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={2}
                  name="Sessions" 
                  dot={{ fill: 'hsl(var(--secondary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Module Performance Breakdown */}
      {modulePerformance.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Performance by Module Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={modulePerformance}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="module_type" 
                    tick={{ fill: 'currentColor' }}
                    tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                  />
                  <YAxis tick={{ fill: 'currentColor' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="avg_score" fill="hsl(var(--primary))" name="Avg Score %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Module Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modulePerformance.map((module) => (
                  <div key={module.module_type} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getModuleIcon(module.module_type)}</span>
                      <div>
                        <p className="font-semibold capitalize">{module.module_type}</p>
                        <p className="text-sm text-muted-foreground">{module.attempts} attempts</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{module.avg_score?.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">Best: {module.best_score?.toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Study Time Distribution */}
      {weeklyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Weekly Study Time (minutes)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="week_start" 
                  tick={{ fill: 'currentColor' }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis tick={{ fill: 'currentColor' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return `Week of ${date.toLocaleDateString()}`;
                  }}
                />
                <Bar dataKey="total_time_minutes" fill="hsl(var(--primary))" name="Study Time (min)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
