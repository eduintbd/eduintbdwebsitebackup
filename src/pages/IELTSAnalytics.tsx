import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, BarChart3, PieChart, Target, Calendar, 
  Flame, ArrowUp, ArrowDown, Clock, BookOpen, 
  CheckCircle, AlertCircle, Lock, Award, Zap
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Legend, PieChart as RechartsPie, 
  Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface AnalyticsData {
  totalSessions: number;
  totalTime: number;
  avgScore: number;
  bestScore: number;
  streak: number;
  activeDays: number;
  totalQuestionsAttempted: number;
  totalCorrectAnswers: number;
  daysSinceLastPractice: number;
  modulePerformance: {
    module_type: string;
    avg_score: number;
    best_score: number;
    lowest_score: number;
    attempts: number;
    avg_duration_seconds: number;
  }[];
  weeklyProgress: {
    week_start: string;
    sessions_count: number;
    avg_score: number;
    total_time_minutes: number;
    modules_completed: number;
  }[];
}

const features = [
  {
    title: "Performance Tracking",
    description: "Visualize your progress over time with detailed line graphs showing band score trends",
    icon: TrendingUp,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10"
  },
  {
    title: "Module Comparison",
    description: "Compare your performance across Reading, Writing, Listening, and Speaking modules",
    icon: BarChart3,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  {
    title: "Skill Distribution",
    description: "See your strengths and weaknesses across different question types and skills",
    icon: PieChart,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10"
  },
  {
    title: "Score Prediction",
    description: "Get AI-powered predictions of your likely band score based on current performance",
    icon: TrendingUp,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10"
  },
  {
    title: "Goal Tracking",
    description: "Set target band scores and track your progress towards achieving them",
    icon: Target,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10"
  },
  {
    title: "Study Streak",
    description: "Monitor your consistency with daily study streak tracking and milestones",
    icon: Flame,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10"
  }
];

const COLORS = ['hsl(var(--primary))', 'hsl(142.1 76.2% 36.3%)', 'hsl(262.1 83.3% 57.8%)', 'hsl(346.8 77.2% 49.8%)'];
const MODULE_COLORS: Record<string, string> = {
  reading: '#10b981',
  writing: '#3b82f6',
  listening: '#8b5cf6',
  speaking: '#f43f5e'
};

const IELTSAnalytics = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      await fetchAnalytics(user.id);
    }
    setLoading(false);
  };

  const fetchAnalytics = async (userId: string) => {
    try {
      // Fetch overall performance
      const { data: perfData, error: perfError } = await supabase
        .from('user_performance_analytics')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (perfError) console.error('Performance fetch error:', perfError);

      // Fetch module-wise performance
      const { data: moduleData, error: moduleError } = await supabase
        .from('module_performance_by_type')
        .select('*')
        .eq('user_id', userId);

      if (moduleError) console.error('Module fetch error:', moduleError);

      // Fetch weekly progress
      const { data: weeklyData, error: weeklyError } = await supabase
        .rpc('get_weekly_progress', { p_user_id: userId });

      if (weeklyError) console.error('Weekly progress fetch error:', weeklyError);

      // Calculate streak
      const { data: streakData, error: streakError } = await supabase
        .rpc('calculate_study_streak', { p_user_id: userId });

      if (streakError) console.error('Streak fetch error:', streakError);

      setAnalytics({
        totalSessions: perfData?.total_sessions || 0,
        totalTime: Math.round((perfData?.total_study_time_seconds || 0) / 60),
        avgScore: Math.round(perfData?.avg_score || 0),
        bestScore: Math.round(perfData?.best_score || 0),
        streak: streakData || 0,
        activeDays: perfData?.active_days || 0,
        totalQuestionsAttempted: perfData?.total_questions_attempted || 0,
        totalCorrectAnswers: perfData?.total_correct_answers || 0,
        daysSinceLastPractice: Math.floor(perfData?.days_since_last_practice || 0),
        modulePerformance: moduleData || [],
        weeklyProgress: weeklyData || []
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const getModuleColor = (moduleType: string) => {
    return MODULE_COLORS[moduleType] || '#6b7280';
  };

  const predictBandScore = () => {
    if (!analytics || analytics.avgScore === 0) return "N/A";
    const score = analytics.avgScore;
    if (score >= 90) return "9.0";
    if (score >= 80) return "8.0-8.5";
    if (score >= 70) return "7.0-7.5";
    if (score >= 60) return "6.0-6.5";
    if (score >= 50) return "5.0-5.5";
    return "Below 5.0";
  };

  const formatTime = (minutes: number) => {
    if (!minutes) return "0h 0m";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getAccuracyRate = () => {
    if (!analytics || analytics.totalQuestionsAttempted === 0) return 0;
    return Math.round((analytics.totalCorrectAnswers / analytics.totalQuestionsAttempted) * 100);
  };

  // Prepare radar chart data for module comparison
  const radarData = analytics?.modulePerformance.map(m => ({
    subject: m.module_type.charAt(0).toUpperCase() + m.module_type.slice(1),
    score: Math.round(m.avg_score || 0),
    fullMark: 100
  })) || [];

  // Prepare pie chart data for attempts distribution
  const pieData = analytics?.modulePerformance.map(m => ({
    name: m.module_type.charAt(0).toUpperCase() + m.module_type.slice(1),
    value: m.attempts,
    color: getModuleColor(m.module_type)
  })) || [];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 pt-16 sm:pt-20 flex items-center justify-center">
          <div className="space-y-4 w-full max-w-md px-4">
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-16 sm:pt-20">
        {/* Hero Section */}
        <section className="relative py-6 sm:py-10 md:py-14 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="max-w-5xl mx-auto text-center relative z-10 px-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 leading-tight">
              Advanced <span className="text-primary">Analytics Dashboard</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Track your progress with detailed insights, performance graphs, and comprehensive reports
            </p>
          </div>
        </section>

        {/* User Analytics (if logged in with data) */}
        {user && analytics && analytics.totalSessions > 0 ? (
          <section className="py-6 sm:py-8 md:py-12 px-4">
            <div className="max-w-6xl mx-auto">
              {/* Stats Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <Card className="p-3 sm:p-4 text-center hover:shadow-lg transition-shadow">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-primary" />
                  <p className="text-lg sm:text-xl md:text-2xl font-bold">{analytics.totalSessions}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Total Sessions</p>
                </Card>
                <Card className="p-3 sm:p-4 text-center hover:shadow-lg transition-shadow">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-blue-500" />
                  <p className="text-lg sm:text-xl md:text-2xl font-bold">{formatTime(analytics.totalTime)}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Study Time</p>
                </Card>
                <Card className="p-3 sm:p-4 text-center hover:shadow-lg transition-shadow">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-emerald-500" />
                  <p className="text-lg sm:text-xl md:text-2xl font-bold">{analytics.avgScore}%</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Avg Score</p>
                </Card>
                <Card className="p-3 sm:p-4 text-center hover:shadow-lg transition-shadow">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-amber-500" />
                  <p className="text-lg sm:text-xl md:text-2xl font-bold">{analytics.bestScore}%</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Best Score</p>
                </Card>
                <Card className="p-3 sm:p-4 text-center hover:shadow-lg transition-shadow">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-purple-500" />
                  <p className="text-lg sm:text-xl md:text-2xl font-bold">{getAccuracyRate()}%</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Accuracy</p>
                </Card>
                <Card className="p-3 sm:p-4 text-center hover:shadow-lg transition-shadow">
                  <Flame className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-orange-500" />
                  <p className="text-lg sm:text-xl md:text-2xl font-bold">{analytics.streak} 🔥</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Day Streak</p>
                </Card>
              </div>

              {/* Predicted Band Score Card */}
              <Card className="p-4 sm:p-6 mb-6 sm:mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-5 h-5 text-primary" />
                      <h3 className="font-bold text-base sm:text-lg">Predicted IELTS Band Score</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Based on your current performance across all modules</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">{predictBandScore()}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {analytics.daysSinceLastPractice === 0 ? "Practiced today!" : `${analytics.daysSinceLastPractice} days since last practice`}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Tabs for different views */}
              <Tabs defaultValue="overview" className="mb-8">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
                  <TabsTrigger value="modules" className="text-xs sm:text-sm">Module Comparison</TabsTrigger>
                  <TabsTrigger value="trends" className="text-xs sm:text-sm">Trends</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Weekly Progress Chart */}
                    {analytics.weeklyProgress.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Weekly Progress
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={analytics.weeklyProgress}>
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis 
                                dataKey="week_start" 
                                tick={{ fontSize: 10, fill: 'currentColor' }}
                                tickFormatter={(value) => {
                                  const date = new Date(value);
                                  return `${date.getMonth() + 1}/${date.getDate()}`;
                                }}
                              />
                              <YAxis tick={{ fontSize: 10, fill: 'currentColor' }} domain={[0, 100]} />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'hsl(var(--card))', 
                                  border: '1px solid hsl(var(--border))',
                                  borderRadius: '8px',
                                  fontSize: '12px'
                                }}
                                labelFormatter={(value) => {
                                  const date = new Date(value);
                                  return `Week of ${date.toLocaleDateString()}`;
                                }}
                              />
                              <Legend wrapperStyle={{ fontSize: '12px' }} />
                              <Line 
                                type="monotone" 
                                dataKey="avg_score" 
                                stroke="hsl(var(--primary))" 
                                strokeWidth={2}
                                name="Avg Score %" 
                                dot={{ fill: 'hsl(var(--primary))', r: 3 }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="sessions_count" 
                                stroke="#10b981" 
                                strokeWidth={2}
                                name="Sessions" 
                                dot={{ fill: '#10b981', r: 3 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    )}

                    {/* Practice Distribution Pie Chart */}
                    {pieData.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                            <PieChart className="w-4 h-4" />
                            Practice Distribution
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={250}>
                            <RechartsPie>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                              >
                                {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'hsl(var(--card))', 
                                  border: '1px solid hsl(var(--border))',
                                  borderRadius: '8px'
                                }}
                              />
                            </RechartsPie>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Module Performance Bars */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm sm:text-base">Module Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {['reading', 'writing', 'listening', 'speaking'].map((module) => {
                          const moduleData = analytics.modulePerformance.find(m => m.module_type === module);
                          const avgScore = moduleData?.avg_score || 0;
                          const bestScore = moduleData?.best_score || 0;
                          const attempts = moduleData?.attempts || 0;
                          return (
                            <div key={module} className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="capitalize font-medium flex items-center gap-2">
                                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getModuleColor(module) }} />
                                  {module}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  Avg: {Math.round(avgScore)}% | Best: {Math.round(bestScore)}% | {attempts} attempts
                                </span>
                              </div>
                              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                                  style={{ width: `${avgScore}%`, backgroundColor: getModuleColor(module) }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Module Comparison Tab */}
                <TabsContent value="modules" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Radar Chart for Module Comparison */}
                    {radarData.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Skill Balance
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <RadarChart data={radarData}>
                              <PolarGrid />
                              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: 'currentColor' }} />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                              <Radar
                                name="Score"
                                dataKey="score"
                                stroke="hsl(var(--primary))"
                                fill="hsl(var(--primary))"
                                fillOpacity={0.3}
                                strokeWidth={2}
                              />
                              <Tooltip />
                            </RadarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    )}

                    {/* Bar Chart for Module Comparison */}
                    {analytics.modulePerformance.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Score Comparison
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.modulePerformance}>
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis 
                                dataKey="module_type" 
                                tick={{ fontSize: 10, fill: 'currentColor' }}
                                tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                              />
                              <YAxis tick={{ fontSize: 10, fill: 'currentColor' }} domain={[0, 100]} />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'hsl(var(--card))', 
                                  border: '1px solid hsl(var(--border))',
                                  borderRadius: '8px'
                                }}
                              />
                              <Legend wrapperStyle={{ fontSize: '12px' }} />
                              <Bar dataKey="avg_score" fill="hsl(var(--primary))" name="Avg Score" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="best_score" fill="#10b981" name="Best Score" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Detailed Module Stats */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {['reading', 'writing', 'listening', 'speaking'].map((module) => {
                      const moduleData = analytics.modulePerformance.find(m => m.module_type === module);
                      const icons: Record<string, string> = {
                        reading: "📖",
                        writing: "✍️",
                        listening: "🎧",
                        speaking: "🗣️"
                      };
                      return (
                        <Card key={module} className="p-4 hover:shadow-lg transition-shadow" style={{ borderTopColor: getModuleColor(module), borderTopWidth: '3px' }}>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">{icons[module]}</span>
                            <h3 className="font-bold capitalize">{module}</h3>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Attempts</span>
                              <span className="font-medium">{moduleData?.attempts || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Avg Score</span>
                              <span className="font-medium">{Math.round(moduleData?.avg_score || 0)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Best Score</span>
                              <span className="font-medium text-emerald-500">{Math.round(moduleData?.best_score || 0)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Lowest Score</span>
                              <span className="font-medium text-rose-500">{Math.round(moduleData?.lowest_score || 0)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Avg Time</span>
                              <span className="font-medium">{Math.round((moduleData?.avg_duration_seconds || 0) / 60)}m</span>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>

                {/* Trends Tab */}
                <TabsContent value="trends" className="space-y-6">
                  {analytics.weeklyProgress.length > 0 ? (
                    <>
                      {/* Weekly Study Time Chart */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Weekly Study Time (minutes)
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={analytics.weeklyProgress}>
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis 
                                dataKey="week_start" 
                                tick={{ fontSize: 10, fill: 'currentColor' }}
                                tickFormatter={(value) => {
                                  const date = new Date(value);
                                  return `${date.getMonth() + 1}/${date.getDate()}`;
                                }}
                              />
                              <YAxis tick={{ fontSize: 10, fill: 'currentColor' }} />
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
                              <Bar dataKey="total_time_minutes" fill="hsl(var(--primary))" name="Study Time (min)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      {/* Sessions per Week Chart */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Sessions per Week
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={analytics.weeklyProgress}>
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis 
                                dataKey="week_start" 
                                tick={{ fontSize: 10, fill: 'currentColor' }}
                                tickFormatter={(value) => {
                                  const date = new Date(value);
                                  return `${date.getMonth() + 1}/${date.getDate()}`;
                                }}
                              />
                              <YAxis tick={{ fontSize: 10, fill: 'currentColor' }} />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'hsl(var(--card))', 
                                  border: '1px solid hsl(var(--border))',
                                  borderRadius: '8px'
                                }}
                              />
                              <Legend wrapperStyle={{ fontSize: '12px' }} />
                              <Bar dataKey="sessions_count" fill="#10b981" name="Sessions" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="modules_completed" fill="#8b5cf6" name="Unique Modules" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      {/* Score Trend Line Chart */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Score Trend (12 Weeks)
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={analytics.weeklyProgress}>
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis 
                                dataKey="week_start" 
                                tick={{ fontSize: 10, fill: 'currentColor' }}
                                tickFormatter={(value) => {
                                  const date = new Date(value);
                                  return `${date.getMonth() + 1}/${date.getDate()}`;
                                }}
                              />
                              <YAxis tick={{ fontSize: 10, fill: 'currentColor' }} domain={[0, 100]} />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'hsl(var(--card))', 
                                  border: '1px solid hsl(var(--border))',
                                  borderRadius: '8px'
                                }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="avg_score" 
                                stroke="hsl(var(--primary))" 
                                strokeWidth={3}
                                name="Avg Score %" 
                                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                                activeDot={{ r: 6 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <Card className="p-8 text-center">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-bold text-lg mb-2">No Weekly Data Yet</h3>
                      <p className="text-muted-foreground mb-4">Complete more practice sessions to see your weekly trends</p>
                      <Button onClick={() => navigate('/ielts/materials')}>Start Practicing</Button>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </section>
        ) : user && analytics && analytics.totalSessions === 0 ? (
          // Logged in but no practice data
          <section className="py-8 sm:py-10 md:py-12 px-4">
            <div className="max-w-3xl mx-auto">
              <Card className="p-6 sm:p-8 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg sm:text-xl font-bold mb-2">No Practice Data Yet</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Complete some practice modules to see your analytics and progress trends!
                </p>
                <Button size="lg" onClick={() => navigate("/ielts/materials")}>
                  Start Practicing
                </Button>
              </Card>
            </div>
          </section>
        ) : (
          // Not logged in
          <>
            {/* Features Grid */}
            <section className="py-8 sm:py-10 md:py-12 px-4 max-w-5xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={idx} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4 sm:p-6">
                        <div className={`inline-flex p-2 sm:p-3 rounded-xl ${feature.bgColor} mb-3 sm:mb-4`}>
                          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${feature.color}`} />
                        </div>
                        <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">{feature.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">{feature.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            <section className="py-8 sm:py-10 md:py-12 px-4">
              <div className="max-w-3xl mx-auto">
                <Card className="p-6 sm:p-8 text-center">
                  <Lock className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Sign in to View Your Analytics</h3>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-4 sm:mb-6">
                    Track your progress, view detailed performance metrics, and get AI-powered insights
                  </p>
                  <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate("/login")}>
                    Sign In Now
                  </Button>
                </Card>
              </div>
            </section>
          </>
        )}

        {/* CTA */}
        <section className="py-8 sm:py-10 md:py-12 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">Ready to Track Your Progress?</h2>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-4 sm:mb-6">
              Start practicing and watch your analytics grow
            </p>
            <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate("/ielts/materials")}>
              Start Practicing Now
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default IELTSAnalytics;