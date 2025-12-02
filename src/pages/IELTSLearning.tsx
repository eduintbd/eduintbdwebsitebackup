import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, PenTool, Headphones, Mic, Trophy, TrendingUp, Target, Lock, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AnalyticsDashboard } from "@/components/ielts/AnalyticsDashboard";

interface Module {
  id: string;
  title: string;
  description: string;
  module_type: string;
  difficulty: string;
  order_index: number;
}

interface UserProgress {
  module_id: string;
  completed: boolean;
  score: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  badge_icon: string;
  earned_at: string;
}

interface ProblemArea {
  module_type: string;
  skill_area: string;
  error_count: number;
  improvement_suggestions: string;
}

const IELTSLearning = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [problemAreas, setProblemAreas] = useState<ProblemArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("modules");

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    await fetchData(user?.id);
  };

  const fetchData = async (userId?: string) => {
    try {
      const { data: modulesData } = await supabase
        .from("ielts_modules")
        .select("*")
        .order("order_index");
      
      setModules(modulesData || []);

      if (userId) {
        const { data: progressData } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", userId);

        const { data: achievementsData } = await supabase
          .from("achievements")
          .select("*")
          .eq("user_id", userId)
          .order("earned_at", { ascending: false });

        const { data: problemAreasData } = await supabase
          .from("problem_areas")
          .select("*")
          .eq("user_id", userId)
          .order("error_count", { ascending: false });

        setProgress(progressData || []);
        setAchievements(achievementsData || []);
        setProblemAreas(problemAreasData || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load learning data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getModuleIcon = (type: string) => {
    switch (type) {
      case "reading": return <BookOpen className="w-6 h-6" />;
      case "writing": return <PenTool className="w-6 h-6" />;
      case "listening": return <Headphones className="w-6 h-6" />;
      case "speaking": return <Mic className="w-6 h-6" />;
      default: return <BookOpen className="w-6 h-6" />;
    }
  };

  const getProgressPercentage = () => {
    if (!user || modules.length === 0) return 0;
    const completed = progress.filter(p => p.completed).length;
    return Math.round((completed / modules.length) * 100);
  };

  const getAverageScore = () => {
    if (!user || progress.length === 0) return 0;
    const scores = progress.filter(p => p.score).map(p => p.score);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500";
      case "intermediate": return "bg-yellow-500";
      case "advanced": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const groupedModules = modules.reduce((acc, module) => {
    if (!acc[module.module_type]) {
      acc[module.module_type] = [];
    }
    acc[module.module_type].push(module);
    return acc;
  }, {} as Record<string, Module[]>);

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
      <main className="flex-1 py-12 px-4 max-w-7xl mx-auto w-full">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">AI-Powered IELTS Learning</h1>
            <p className="text-xl text-muted-foreground">
              Practice for free • Get AI feedback • Track your progress
            </p>
            
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <MessageSquare className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-lg font-semibold mb-1">AI Study Buddy</h3>
                    <p className="text-sm text-muted-foreground">
                      Get instant answers, personalized study plans, and expert IELTS guidance
                    </p>
                  </div>
                  <Button onClick={() => navigate("/ielts/ai-buddy")} size="lg">
                    Start Chatting
                  </Button>
                </div>
              </CardContent>
            </Card>

            {!user && (
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  You're using the free version. <Button variant="link" className="h-auto p-0" onClick={() => navigate("/login")}>Create a free account</Button> to track your progress and achievements!
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="modules">All Modules</TabsTrigger>
              <TabsTrigger value="dashboard" disabled={!user}>
                Dashboard {!user && <Lock className="ml-2 h-3 w-3" />}
              </TabsTrigger>
              <TabsTrigger value="analytics" disabled={!user}>
                Analytics {!user && <Lock className="ml-2 h-3 w-3" />}
              </TabsTrigger>
              <TabsTrigger value="achievements" disabled={!user}>
                Achievements {!user && <Lock className="ml-2 h-3 w-3" />}
              </TabsTrigger>
              <TabsTrigger value="problem-areas" disabled={!user}>
                Focus Areas {!user && <Lock className="ml-2 h-3 w-3" />}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="modules" className="space-y-6 mt-6">
              {Object.entries(groupedModules).map(([type, typeModules]) => (
                <div key={type} className="space-y-4">
                  <div className="flex items-center gap-3">
                    {getModuleIcon(type)}
                    <h2 className="text-2xl font-bold capitalize">{type}</h2>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {typeModules.map((module) => {
                      const moduleProgress = progress.find(p => p.module_id === module.id);
                      return (
                        <Card key={module.id} className="p-6 hover:shadow-lg transition-shadow">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{module.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {module.description}
                                </p>
                              </div>
                              {moduleProgress?.completed && (
                                <Trophy className="w-5 h-5 text-yellow-500" />
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <Badge className={getDifficultyColor(module.difficulty)}>
                                {module.difficulty}
                              </Badge>
                              {user && moduleProgress && (
                                <span className="text-sm font-medium">
                                  Score: {moduleProgress.score}%
                                </span>
                              )}
                            </div>
                            <Button 
                              className="w-full" 
                              onClick={() => {
                                const practiceRoutes: Record<string, string> = {
                                  reading: "/ielts/reading",
                                  writing: "/ielts/writing",
                                  listening: "/ielts/listening",
                                  speaking: "/ielts/speaking",
                                };
                                navigate(practiceRoutes[module.module_type] || `/ielts/module/${module.id}`);
                              }}
                            >
                              Start Practice
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-6 mt-6">
              {user && (
                <div className="grid gap-6 md:grid-cols-3">
                  <Card className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Target className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Overall Progress</p>
                        <p className="text-2xl font-bold">{getProgressPercentage()}%</p>
                      </div>
                    </div>
                    <Progress value={getProgressPercentage()} className="mt-4" />
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Average Score</p>
                        <p className="text-2xl font-bold">{getAverageScore()}%</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-yellow-100 rounded-lg">
                        <Trophy className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Achievements</p>
                        <p className="text-2xl font-bold">{achievements.length}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              {user ? (
                <AnalyticsDashboard userId={user.id} />
              ) : (
                <Card className="p-8 text-center">
                  <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Analytics Unavailable</h3>
                  <p className="text-muted-foreground mb-4">
                    Sign in to view your detailed analytics, progress trends, and performance metrics.
                  </p>
                  <Button onClick={() => navigate("/login")}>
                    Sign In to View Analytics
                  </Button>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6 mt-6">
              {user && achievements.length === 0 ? (
                <Card className="p-8 text-center">
                  <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Achievements Yet</h3>
                  <p className="text-muted-foreground">
                    Complete modules to earn achievements!
                  </p>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {achievements.map((achievement) => (
                    <Card key={achievement.id} className="p-6">
                      <div className="text-center space-y-3">
                        <div className="text-4xl">{achievement.badge_icon}</div>
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Earned: {new Date(achievement.earned_at).toLocaleDateString()}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="problem-areas" className="space-y-6 mt-6">
              {user && problemAreas.length === 0 ? (
                <Card className="p-8 text-center">
                  <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Focus Areas Yet</h3>
                  <p className="text-muted-foreground">
                    Complete some exercises to identify areas for improvement
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {problemAreas.map((area, index) => (
                    <Card key={index} className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold capitalize">
                            {area.module_type} - {area.skill_area}
                          </h3>
                          <Badge variant="destructive">
                            {area.error_count} errors
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {area.improvement_suggestions}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default IELTSLearning;
