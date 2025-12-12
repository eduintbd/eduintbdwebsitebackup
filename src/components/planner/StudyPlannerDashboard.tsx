import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { 
  Globe, GraduationCap, DollarSign, FileCheck, TrendingUp, 
  Calendar, Target, MapPin, Clock, CheckCircle2, ChevronRight,
  Plane, BookOpen, Award, FileText, Users
} from "lucide-react";
import { GoalSetting } from "./GoalSetting";
import { CountryComparison } from "./CountryComparison";
import { VisaChecklist } from "./VisaChecklist";
import { ScholarshipFinder } from "./ScholarshipFinder";
import { ApplicationTimeline } from "./ApplicationTimeline";

interface UserGoal {
  id: string;
  goal_type: string;
  target_value: number | null;
  target_date: string | null;
  status: string;
  description: string | null;
  module_type: string | null;
}

export function StudyPlannerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      fetchGoals(session.user.id);
    }
    setLoading(false);
  };

  const fetchGoals = async (userId: string) => {
    const { data, error } = await supabase
      .from('study_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (data) {
      setGoals(data);
    }
  };

  const quickStats = [
    { label: "Active Goals", value: goals.filter(g => g.status === 'active').length, icon: Target, color: "text-primary" },
    { label: "Countries Explored", value: 6, icon: Globe, color: "text-blue-500" },
    { label: "Scholarships Found", value: 12, icon: Award, color: "text-amber-500" },
    { label: "Tasks Completed", value: goals.filter(g => g.status === 'completed').length, icon: CheckCircle2, color: "text-green-500" },
  ];

  const upcomingDeadlines = [
    { title: "IELTS Exam", date: "2025-02-15", type: "exam" },
    { title: "UK Application Deadline", date: "2025-01-30", type: "application" },
    { title: "Scholarship Application", date: "2025-02-01", type: "scholarship" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, idx) => (
          <Card key={idx} className="border-2 hover:border-primary/50 transition-all">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto gap-2 bg-transparent p-0">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border-2">
            <TrendingUp className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="goals" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border-2">
            <Target className="w-4 h-4 mr-2" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="countries" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border-2">
            <Globe className="w-4 h-4 mr-2" />
            Countries
          </TabsTrigger>
          <TabsTrigger value="scholarships" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border-2">
            <Award className="w-4 h-4 mr-2" />
            Scholarships
          </TabsTrigger>
          <TabsTrigger value="visa" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border-2">
            <FileCheck className="w-4 h-4 mr-2" />
            Visa Guide
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Progress Overview */}
            <Card className="lg:col-span-2 border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Your Progress
                </CardTitle>
                <CardDescription>Track your study abroad journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ApplicationTimeline />
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingDeadlines.map((deadline, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className={`w-2 h-2 rounded-full ${
                      deadline.type === 'exam' ? 'bg-blue-500' : 
                      deadline.type === 'application' ? 'bg-green-500' : 'bg-amber-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{deadline.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(deadline.date).toLocaleDateString()}</p>
                    </div>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
                <Button variant="outline" className="w-full" size="sm">
                  View All Deadlines
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with your planning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" onClick={() => setActiveTab("countries")}>
                  <Globe className="w-6 h-6 text-primary" />
                  <span>Explore Countries</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" onClick={() => setActiveTab("scholarships")}>
                  <DollarSign className="w-6 h-6 text-primary" />
                  <span>Find Scholarships</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" onClick={() => setActiveTab("visa")}>
                  <FileText className="w-6 h-6 text-primary" />
                  <span>Visa Checklist</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" onClick={() => navigate("/ai-advisor")}>
                  <Users className="w-6 h-6 text-primary" />
                  <span>Talk to Advisor</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="mt-6">
          <GoalSetting user={user} goals={goals} onGoalsUpdate={() => user && fetchGoals(user.id)} />
        </TabsContent>

        <TabsContent value="countries" className="mt-6">
          <CountryComparison />
        </TabsContent>

        <TabsContent value="scholarships" className="mt-6">
          <ScholarshipFinder />
        </TabsContent>

        <TabsContent value="visa" className="mt-6">
          <VisaChecklist />
        </TabsContent>
      </Tabs>
    </div>
  );
}
