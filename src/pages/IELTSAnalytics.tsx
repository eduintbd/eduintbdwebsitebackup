import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, BarChart3, PieChart, Target, Calendar, 
  Flame, ArrowUp, ArrowDown, Clock, BookOpen, 
  CheckCircle, AlertCircle, Lock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsData {
  totalSessions: number;
  totalTime: number;
  avgScore: number;
  bestScore: number;
  streak: number;
  modulePerformance: {
    module_type: string;
    avg_score: number;
    attempts: number;
  }[];
  weeklyProgress: {
    week_start: string;
    sessions_count: number;
    avg_score: number;
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
      const { data: perfData } = await supabase
        .from('user_performance_analytics')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Fetch module-wise performance
      const { data: moduleData } = await supabase
        .from('module_performance_by_type')
        .select('*')
        .eq('user_id', userId);

      // Fetch weekly progress
      const { data: weeklyData } = await supabase
        .rpc('get_weekly_progress', { p_user_id: userId });

      // Calculate streak
      const { data: streakData } = await supabase
        .rpc('calculate_study_streak', { p_user_id: userId });

      setAnalytics({
        totalSessions: perfData?.total_sessions || 0,
        totalTime: Math.round((perfData?.total_study_time_seconds || 0) / 60),
        avgScore: Math.round(perfData?.avg_score || 0),
        bestScore: Math.round(perfData?.best_score || 0),
        streak: streakData || 0,
        modulePerformance: moduleData || [],
        weeklyProgress: weeklyData || []
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const getModuleColor = (moduleType: string) => {
    const colors: Record<string, string> = {
      reading: "bg-emerald-500",
      writing: "bg-blue-500",
      listening: "bg-purple-500",
      speaking: "bg-rose-500"
    };
    return colors[moduleType] || "bg-gray-500";
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Advanced <span className="text-primary">Analytics Dashboard</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track your progress with detailed insights, performance graphs, and comprehensive reports
            </p>
          </div>
        </section>

        {/* Data-Driven Banner */}
        <section className="py-8 px-4 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <Badge variant="secondary">Data-Driven Learning</Badge>
                </div>
                <p className="text-muted-foreground">
                  Make informed decisions about your study plan with comprehensive analytics and insights
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-12 px-4 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-4`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* User Analytics (if logged in) */}
        {user && analytics ? (
          <section className="py-12 px-4 bg-muted/30">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Your Performance</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <Card className="p-4 text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">{analytics.totalTime}</p>
                  <p className="text-xs text-muted-foreground">Minutes Studied</p>
                </Card>
                <Card className="p-4 text-center">
                  <CheckCircle className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                  <p className="text-2xl font-bold">{analytics.totalSessions}</p>
                  <p className="text-xs text-muted-foreground">Sessions</p>
                </Card>
                <Card className="p-4 text-center">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                  <p className="text-2xl font-bold">{analytics.avgScore}%</p>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </Card>
                <Card className="p-4 text-center">
                  <Target className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                  <p className="text-2xl font-bold">{analytics.bestScore}%</p>
                  <p className="text-xs text-muted-foreground">Best Score</p>
                </Card>
                <Card className="p-4 text-center">
                  <Flame className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                  <p className="text-2xl font-bold">{analytics.streak}</p>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </Card>
              </div>

              {/* Predicted Band Score */}
              <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 to-secondary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">Predicted Band Score</h3>
                    <p className="text-sm text-muted-foreground">Based on your current performance</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-primary">{predictBandScore()}</p>
                    <p className="text-sm text-muted-foreground">IELTS Band</p>
                  </div>
                </div>
              </Card>

              {/* Module Performance */}
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Module Performance</h3>
                <div className="space-y-4">
                  {['reading', 'writing', 'listening', 'speaking'].map((module) => {
                    const moduleData = analytics.modulePerformance.find(m => m.module_type === module);
                    const score = moduleData?.avg_score || 0;
                    return (
                      <div key={module} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="capitalize font-medium">{module}</span>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(score)}% ({moduleData?.attempts || 0} attempts)
                          </span>
                        </div>
                        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`absolute inset-y-0 left-0 ${getModuleColor(module)} rounded-full transition-all`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </section>
        ) : (
          <section className="py-12 px-4">
            <div className="max-w-3xl mx-auto">
              <Card className="p-8 text-center">
                <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">Sign in to View Your Analytics</h3>
                <p className="text-muted-foreground mb-6">
                  Track your progress, view detailed performance metrics, and get AI-powered insights
                </p>
                <Button size="lg" onClick={() => navigate("/login")}>
                  Sign In Now
                </Button>
              </Card>
            </div>
          </section>
        )}

        {/* What's Included */}
        <section className="py-12 px-4 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Your Analytics Include</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Performance Metrics</h3>
              <ul className="space-y-2">
                {["Overall band score tracking", "Module-wise performance", "Question type analysis", "Time management insights"].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Progress Reports</h3>
              <ul className="space-y-2">
                {["Weekly performance summaries", "Monthly progress reports", "Strength & weakness analysis", "Personalized recommendations"].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Track Your Progress?</h2>
            <p className="text-muted-foreground mb-6">
              Start practicing and watch your analytics grow
            </p>
            <Button size="lg" onClick={() => navigate("/ielts/materials")}>
              View Your Dashboard
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default IELTSAnalytics;