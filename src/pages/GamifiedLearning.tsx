import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, Users, Gamepad2, Zap, Target, Shield, 
  BookOpen, Headphones, Clock, Star, Lock, Play,
  Medal, Flame, Crown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const games = [
  {
    id: "vocabulary-race",
    title: "Vocabulary Race",
    description: "Speed challenge to match words with meanings",
    icon: Zap,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    difficulty: "Easy",
    duration: "5 min",
    points: "100-500",
    available: true
  },
  {
    id: "grammar-battle",
    title: "Grammar Battle",
    description: "Fix sentences and compete with other learners",
    icon: Shield,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    difficulty: "Medium",
    duration: "10 min",
    points: "200-800",
    available: true
  },
  {
    id: "listening-puzzle",
    title: "Listening Puzzle",
    description: "Complete the story by listening to audio clips",
    icon: Headphones,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    difficulty: "Medium",
    duration: "15 min",
    points: "300-1000",
    available: true
  },
  {
    id: "reading-sprint",
    title: "Reading Sprint",
    description: "Answer questions as fast as you can",
    icon: BookOpen,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    difficulty: "Hard",
    duration: "20 min",
    points: "500-1500",
    available: true
  }
];

const achievements = [
  { id: 1, title: "First Steps", description: "Complete your first practice", icon: "🎯", unlocked: false },
  { id: 2, title: "Speed Demon", description: "Finish 10 exercises in under 5 minutes", icon: "⚡", unlocked: false },
  { id: 3, title: "Perfect Score", description: "Get 100% on any module", icon: "🏆", unlocked: false },
  { id: 4, title: "Streak Master", description: "Maintain a 30-day study streak", icon: "🔥", unlocked: false },
  { id: 5, title: "Vocabulary King", description: "Learn 500 new words", icon: "📚", unlocked: false },
  { id: 6, title: "Grammar Guru", description: "Complete all grammar exercises", icon: "✨", unlocked: false },
];

const benefits = [
  {
    title: "Increased Motivation",
    description: "Points, badges, and achievements keep you engaged and motivated to continue learning",
    icon: Flame
  },
  {
    title: "Better Retention",
    description: "Interactive gameplay helps you remember vocabulary and grammar rules more effectively",
    icon: Target
  },
  {
    title: "Social Learning",
    description: "Compete with friends and other learners on global leaderboards",
    icon: Users
  },
  {
    title: "Reduced Stress",
    description: "Fun games make IELTS preparation less stressful and more enjoyable",
    icon: Gamepad2
  }
];

const GamifiedLearning = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userPoints, setUserPoints] = useState(0);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500/10 text-green-500";
      case "Medium": return "bg-yellow-500/10 text-yellow-500";
      case "Hard": return "bg-red-500/10 text-red-500";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  const handlePlayGame = (gameId: string) => {
    toast({
      title: "Coming Soon!",
      description: "This game is under development. Check back soon for exciting new features!",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Gamified <span className="text-primary">Learning Experience</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Make IELTS preparation fun with interactive games, achievements, and leaderboards
            </p>
          </div>
        </section>

        {/* Stats Banner */}
        <section className="py-8 px-4 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-3 gap-6">
              <Card className="p-6 text-center border-2 border-primary/20">
                <Trophy className="w-10 h-10 mx-auto mb-3 text-yellow-500" />
                <p className="text-3xl font-bold text-primary">50+</p>
                <p className="text-sm text-muted-foreground">Achievements</p>
              </Card>
              <Card className="p-6 text-center border-2 border-primary/20">
                <Users className="w-10 h-10 mx-auto mb-3 text-blue-500" />
                <p className="text-3xl font-bold text-primary">Global</p>
                <p className="text-sm text-muted-foreground">Leaderboards</p>
              </Card>
              <Card className="p-6 text-center border-2 border-primary/20">
                <Gamepad2 className="w-10 h-10 mx-auto mb-3 text-purple-500" />
                <p className="text-3xl font-bold text-primary">20+</p>
                <p className="text-sm text-muted-foreground">Fun Games</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Games Section */}
        <section className="py-12 px-4 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Learning Games</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {games.map((game) => {
              const Icon = game.icon;
              return (
                <Card key={game.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-3 rounded-xl ${game.bgColor}`}>
                        <Icon className={`w-6 h-6 ${game.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{game.title}</h3>
                        <p className="text-sm text-muted-foreground">{game.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <Badge className={getDifficultyColor(game.difficulty)}>
                        Difficulty: {game.difficulty}
                      </Badge>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {game.duration}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-sm text-yellow-500">
                        <Star className="w-4 h-4" />
                        {game.points} points
                      </span>
                      <Button 
                        onClick={() => handlePlayGame(game.id)}
                        className="gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Play Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Achievements to Unlock</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {achievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`p-4 text-center ${achievement.unlocked ? '' : 'opacity-60'}`}
                >
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <h3 className="font-semibold text-sm">{achievement.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                  {!achievement.unlocked && (
                    <Lock className="w-4 h-4 mx-auto mt-2 text-muted-foreground" />
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 px-4 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Why Gamified Learning Works</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <Card key={idx} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm mt-1">{benefit.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Play & Learn?</h2>
            <p className="text-muted-foreground mb-6">
              Start earning points and achievements while mastering IELTS skills
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/ielts/materials")}>
                Start Practice First
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/ielts-learning")}>
                View All Modules
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default GamifiedLearning;