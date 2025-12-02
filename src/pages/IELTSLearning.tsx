import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, PenTool, Headphones, Mic, Trophy, TrendingUp, 
  Target, MessageSquare, Gamepad2, BarChart3, Users, 
  CheckCircle, Star, Sparkles, ArrowRight, Play
} from "lucide-react";

const features = [
  {
    title: "Unlimited IELTS Materials",
    description: "Access comprehensive Reading, Writing, Listening, and Speaking modules updated daily with global trends.",
    icon: BookOpen,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    route: "/ielts/materials"
  },
  {
    title: "AI Study Coach",
    description: "Get personalized recommendations, weak-skill analysis, and adaptive learning paths powered by AI.",
    icon: MessageSquare,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    route: "/ielts/ai-buddy"
  },
  {
    title: "Gamified Learning",
    description: "Master IELTS through vocabulary races, grammar battles, and listening puzzles that make learning fun.",
    icon: Gamepad2,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    route: "/ielts/gamified"
  },
  {
    title: "Smart Analytics",
    description: "Track your progress with detailed insights, score graphs, streak tracking, and performance metrics.",
    icon: BarChart3,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    route: "/ielts/analytics"
  },
  {
    title: "Mock Tests & Quizzes",
    description: "Unlimited AI-evaluated mock tests with real-time feedback and detailed explanations.",
    icon: Target,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    route: "/ielts/materials"
  },
  {
    title: "Study Abroad Hub",
    description: "Connect your IELTS journey with university applications, visa guidance, and study abroad planning.",
    icon: Users,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    route: "/ai-advisor"
  }
];

const stats = [
  { value: "10,000+", label: "Active Learners" },
  { value: "500K+", label: "Practice Questions" },
  { value: "8.5", label: "Average Band Score" },
  { value: "95%", label: "Success Rate" }
];

const IELTSLearning = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-1">
                  <Sparkles className="w-3 h-3 mr-1" />
                  #1 AI-Powered IELTS Platform in Bangladesh
                </Badge>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Master IELTS with{" "}
                  <span className="text-primary">Unlimited AI Practice</span>
                </h1>
                
                <p className="text-lg text-muted-foreground">
                  Your complete IELTS Academic companion powered by AI. Get unlimited mock tests, 
                  personalized coaching, and real-time feedback to achieve your dream band score.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" onClick={() => navigate("/ielts/materials")} className="gap-2">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate("/ielts/ai-buddy")}>
                    <Play className="w-4 h-4 mr-2" />
                    Talk to AI Coach
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-6 pt-4">
                  {[
                    { icon: CheckCircle, text: "Unlimited Mock Tests" },
                    { icon: MessageSquare, text: "AI Study Coach" },
                    { icon: TrendingUp, text: "Real-Time Feedback" },
                    { icon: Star, text: "Daily Updates" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <item.icon className="w-4 h-4 text-primary" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative hidden md:block">
                <div className="relative w-full aspect-square max-w-md mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl transform rotate-3" />
                  <div className="absolute inset-0 bg-card rounded-3xl shadow-2xl flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-24 h-24 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">IELTS Infinity</h3>
                      <p className="text-muted-foreground text-sm">AI-Powered Learning</p>
                      
                      <div className="mt-6 p-4 bg-emerald-500/10 rounded-xl">
                        <p className="text-3xl font-bold text-emerald-500">8.5</p>
                        <p className="text-sm text-muted-foreground">Avg Band Score</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating card */}
                  <div className="absolute -bottom-4 -left-4 bg-card p-4 rounded-xl shadow-lg border">
                    <p className="text-2xl font-bold text-primary">10,000+</p>
                    <p className="text-xs text-muted-foreground">Active Learners</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Banner */}
        <section className="py-8 px-4 bg-primary text-primary-foreground">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold">{stat.value}</p>
                  <p className="text-sm opacity-80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4">Powered by AI</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need to Ace IELTS
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A complete ecosystem designed for Bangladeshi students aiming to study or migrate abroad
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <Card 
                    key={idx} 
                    className="group cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                    onClick={() => navigate(feature.route)}
                  >
                    <CardContent className="p-6">
                      <div className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-4`}>
                        <Icon className={`w-6 h-6 ${feature.color}`} />
                      </div>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Quick Access Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Quick Start Practice</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: "Reading", icon: BookOpen, color: "emerald", route: "/ielts/reading" },
                { title: "Writing", icon: PenTool, color: "blue", route: "/ielts/writing" },
                { title: "Listening", icon: Headphones, color: "purple", route: "/ielts/listening" },
                { title: "Speaking", icon: Mic, color: "rose", route: "/ielts/speaking" }
              ].map((module, idx) => {
                const Icon = module.icon;
                return (
                  <Card 
                    key={idx}
                    className="p-6 text-center cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 group"
                    onClick={() => navigate(module.route)}
                  >
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-${module.color}-500/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-8 h-8 text-${module.color}-500`} />
                    </div>
                    <h3 className="font-bold">{module.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Start Practice</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* AI Study Buddy CTA */}
        <section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-primary/20 overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-primary/20 rounded-2xl flex items-center justify-center">
                      <MessageSquare className="w-12 h-12 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-2">Meet Your AI Study Buddy</h3>
                    <p className="text-muted-foreground mb-4">
                      Get instant answers, personalized study plans, band score predictions, 
                      and expert IELTS strategies - all powered by advanced AI.
                    </p>
                    <Button size="lg" onClick={() => navigate("/ielts/ai-buddy")}>
                      Start Chatting Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Achieve Your Dream Band Score?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of students who have improved their IELTS scores with our AI-powered platform
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/ielts/materials")}>
                Start Learning Free
              </Button>
              {!user && (
                <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
                  Create Account
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default IELTSLearning;