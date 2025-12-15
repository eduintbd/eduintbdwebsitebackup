import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, PenTool, Headphones, Mic, Play, Clock, FileText, CheckCircle, ArrowLeft } from "lucide-react";

const modules = [
  {
    id: "reading",
    title: "Reading Module",
    description: "Master IELTS Reading with passages from academic journals, newspapers, and books",
    icon: BookOpen,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    stats: {
      questions: "120K+",
      tests: "2,000+",
      time: "60 min"
    },
    features: ["Real exam patterns", "All difficulty levels", "Detailed explanations", "Updated weekly"],
    route: "/ielts/reading"
  },
  {
    id: "writing",
    title: "Writing Module",
    description: "Develop your writing skills with Task 1 & Task 2 practice and AI-powered feedback",
    icon: PenTool,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    stats: {
      questions: "50K+",
      tests: "1,000+",
      time: "60 min"
    },
    features: ["Task 1 & Task 2", "AI band scoring", "Model answers", "Vocabulary tips"],
    route: "/ielts/writing"
  },
  {
    id: "listening",
    title: "Listening Module",
    description: "Improve comprehension with authentic audio materials and varied accents",
    icon: Headphones,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    stats: {
      questions: "80K+",
      tests: "1,500+",
      time: "30 min"
    },
    features: ["Multiple accents", "Section 1-4 practice", "Audio transcripts", "Speed control"],
    route: "/ielts/listening"
  },
  {
    id: "speaking",
    title: "Speaking Module",
    description: "Build confidence with AI-powered speaking practice and pronunciation feedback",
    icon: Mic,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    stats: {
      questions: "30K+",
      tests: "500+",
      time: "15 min"
    },
    features: ["Part 1, 2 & 3", "AI evaluation", "Sample answers", "Pronunciation tips"],
    route: "/ielts/speaking"
  }
];

const IELTSMaterials = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("reading");

  const activeModule = modules.find(m => m.id === activeTab);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-16 sm:pt-20">
        {/* Back Button */}
        <div className="max-w-5xl mx-auto px-4 pt-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/ielts-learning")}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to IELTS Learning
          </Button>
        </div>
        {/* Hero Section */}
        <section className="relative py-6 sm:py-10 md:py-14 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="max-w-5xl mx-auto text-center relative z-10 px-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 leading-tight">
              Comprehensive <span className="text-primary">IELTS Materials</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Access 500K+ practice questions across all IELTS modules with authentic exam patterns
            </p>
          </div>
        </section>

        {/* Materials Section */}
        <section className="py-6 sm:py-8 md:py-12 px-3 sm:px-4 max-w-5xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4 sm:mb-6 md:mb-8 h-auto p-1">
              {modules.map((module) => {
                const Icon = module.icon;
                return (
                  <TabsTrigger 
                    key={module.id} 
                    value={module.id}
                    className="flex items-center justify-center gap-1 sm:gap-2 py-2 px-1 sm:px-3 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline capitalize">{module.id}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <TabsContent key={module.id} value={module.id}>
                  <Card className="border-2">
                    <CardContent className="p-4 sm:p-6 md:p-8">
                      <div className="flex flex-col gap-4 sm:gap-6">
                        {/* Module Info */}
                        <div className="flex-1 space-y-4 sm:space-y-6">
                          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                            <div className={`p-3 sm:p-4 rounded-xl ${module.bgColor} flex-shrink-0`}>
                              <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${module.color}`} />
                            </div>
                            <div>
                              <h2 className="text-lg sm:text-xl md:text-2xl font-bold">{module.title}</h2>
                              <p className="text-sm sm:text-base text-muted-foreground mt-1">{module.description}</p>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-2 sm:gap-4">
                            <div className="text-center p-2 sm:p-4 bg-muted/50 rounded-lg sm:rounded-xl">
                              <p className={`text-base sm:text-xl md:text-2xl font-bold ${module.color}`}>{module.stats.questions}</p>
                              <p className="text-xs sm:text-sm text-muted-foreground">Questions</p>
                            </div>
                            <div className="text-center p-2 sm:p-4 bg-muted/50 rounded-lg sm:rounded-xl">
                              <p className={`text-base sm:text-xl md:text-2xl font-bold ${module.color}`}>{module.stats.tests}</p>
                              <p className="text-xs sm:text-sm text-muted-foreground">Tests</p>
                            </div>
                            <div className="text-center p-2 sm:p-4 bg-muted/50 rounded-lg sm:rounded-xl">
                              <p className={`text-base sm:text-xl md:text-2xl font-bold ${module.color}`}>{module.stats.time}</p>
                              <p className="text-xs sm:text-sm text-muted-foreground">Time</p>
                            </div>
                          </div>

                          {/* Features */}
                          <div>
                            <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">What's Included:</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                              {module.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${module.color.replace('text-', 'bg-')}`} />
                                  <span className="text-xs sm:text-sm">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* CTA */}
                          <Button 
                            size="lg" 
                            className="w-full text-sm sm:text-base"
                            onClick={() => navigate(module.route)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Start {module.id.charAt(0).toUpperCase() + module.id.slice(1)} Practice
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>

          {/* Quick Stats */}
          <div className="mt-6 sm:mt-8 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            <Card className="p-3 sm:p-4 md:p-6 text-center bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-emerald-500" />
              <p className="text-lg sm:text-xl md:text-2xl font-bold">500K+</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Practice Questions</p>
            </Card>
            <Card className="p-3 sm:p-4 md:p-6 text-center bg-gradient-to-br from-blue-500/10 to-blue-500/5">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-blue-500" />
              <p className="text-lg sm:text-xl md:text-2xl font-bold">5,000+</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Mock Tests</p>
            </Card>
            <Card className="p-3 sm:p-4 md:p-6 text-center bg-gradient-to-br from-purple-500/10 to-purple-500/5">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-purple-500" />
              <p className="text-lg sm:text-xl md:text-2xl font-bold">24/7</p>
              <p className="text-xs sm:text-sm text-muted-foreground">AI Feedback</p>
            </Card>
            <Card className="p-3 sm:p-4 md:p-6 text-center bg-gradient-to-br from-rose-500/10 to-rose-500/5">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-rose-500" />
              <p className="text-lg sm:text-xl md:text-2xl font-bold">Daily</p>
              <p className="text-xs sm:text-sm text-muted-foreground">New Content</p>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default IELTSMaterials;