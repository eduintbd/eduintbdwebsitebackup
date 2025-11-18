import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, PenTool, Headphones, Mic, Trophy, TrendingUp, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }
    setUser(user);
    await fetchData(user.id);
  };

  const fetchData = async (userId: string) => {
    try {
      // Fetch modules
      const { data: modulesData } = await supabase
        .from("ielts_modules")
        .select("*")
        .order("order_index");
      
      // Fetch user progress
      const { data: progressData } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", userId);

      // Fetch achievements
      const { data: achievementsData } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", userId)
        .order("earned_at", { ascending: false });

      // Fetch problem areas
      const { data: problemAreasData } = await supabase
        .from("problem_areas")
        .select("*")
        .eq("user_id", userId)
        .order("error_count", { ascending: false });

      setModules(modulesData || []);
      setProgress(progressData || []);
      setAchievements(achievementsData || []);
      setProblemAreas(problemAreasData || []);
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
    if (modules.length === 0) return 0;
    const completed = progress.filter(p => p.completed).length;
    return Math.round((completed / modules.length) * 100);
  };

  const getAverageScore = () => {
    if (progress.length === 0) return 0;
    const total = progress.reduce((sum, p) => sum + (p.score || 0), 0);
    return Math.round(total / progress.length);
  };

  const modulesByType = (type: string) => 
    modules.filter(m => m.module_type === type);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your learning dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">IELTS Learning Platform</h1>
          <p className="text-muted-foreground">Master IELTS with personalized learning and AI-powered feedback</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="problems">Problem Areas</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Progress</p>
                    <p className="text-3xl font-bold">{getProgressPercentage()}%</p>
                  </div>
                </div>
                <Progress value={getProgressPercentage()} className="mt-4" />
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary/10 rounded-full">
                    <TrendingUp className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                    <p className="text-3xl font-bold">{getAverageScore()}%</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/10 rounded-full">
                    <Trophy className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Achievements</p>
                    <p className="text-3xl font-bold">{achievements.length}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Problem Areas */}
            {problemAreas.length > 0 && (
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Areas to Focus On</h3>
                <div className="space-y-3">
                  {problemAreas.slice(0, 3).map((area, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium capitalize">{area.module_type} - {area.skill_area.replace(/_/g, ' ')}</p>
                        <p className="text-sm text-muted-foreground">Errors: {area.error_count}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveTab("problems")}
                      >
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-6">
            {["reading", "writing", "listening", "speaking"].map((type) => {
              const typeModules = modulesByType(type);
              if (typeModules.length === 0) return null;

              return (
                <div key={type}>
                  <h3 className="text-2xl font-semibold mb-4 capitalize flex items-center gap-2">
                    {getModuleIcon(type)}
                    {type}
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {typeModules.map((module) => {
                      const moduleProgress = progress.find(p => p.module_id === module.id);
                      return (
                        <Card key={module.id} className="p-6 hover:shadow-lg transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <Badge variant={module.difficulty === 'beginner' ? 'secondary' : module.difficulty === 'intermediate' ? 'default' : 'destructive'}>
                              {module.difficulty}
                            </Badge>
                            {moduleProgress?.completed && (
                              <Badge variant="outline" className="bg-green-500/10 text-green-600">
                                Completed
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-semibold mb-2">{module.title}</h4>
                          <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                          {moduleProgress && (
                            <p className="text-sm mb-3">Score: <span className="font-semibold">{moduleProgress.score}%</span></p>
                          )}
                          <Button 
                            className="w-full"
                            onClick={() => navigate(`/ielts/module/${module.id}`)}
                          >
                            {moduleProgress?.completed ? 'Review' : 'Start'}
                          </Button>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Your Progress</h3>
              {progress.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Start learning to track your progress!</p>
              ) : (
                <div className="space-y-4">
                  {modules.map((module) => {
                    const moduleProgress = progress.find(p => p.module_id === module.id);
                    return (
                      <div key={module.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getModuleIcon(module.module_type)}
                          <div>
                            <p className="font-medium">{module.title}</p>
                            <p className="text-sm text-muted-foreground capitalize">{module.module_type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {moduleProgress ? (
                            <>
                              <p className="font-semibold">{moduleProgress.score}%</p>
                              <Badge variant={moduleProgress.completed ? 'default' : 'secondary'} className="mt-1">
                                {moduleProgress.completed ? 'Completed' : 'In Progress'}
                              </Badge>
                            </>
                          ) : (
                            <Badge variant="outline">Not Started</Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Problem Areas Tab */}
          <TabsContent value="problems">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Problem Areas</h3>
              {problemAreas.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No problem areas identified yet. Keep practicing!</p>
              ) : (
                <div className="space-y-4">
                  {problemAreas.map((area, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold capitalize">
                          {area.module_type} - {area.skill_area.replace(/_/g, ' ')}
                        </h4>
                        <Badge variant="destructive">{area.error_count} errors</Badge>
                      </div>
                      {area.improvement_suggestions && (
                        <p className="text-sm text-muted-foreground mt-2">{area.improvement_suggestions}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Your Achievements</h3>
              {achievements.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Complete modules to earn achievements!</p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="p-4 border rounded-lg text-center">
                      <div className="text-4xl mb-2">{achievement.badge_icon}</div>
                      <h4 className="font-semibold mb-1">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Earned: {new Date(achievement.earned_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default IELTSLearning;
