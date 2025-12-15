import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type GameType = "vocabulary-race" | "grammar-battle" | "listening-puzzle" | "reading-sprint";

interface SaveGameParams {
  gameType: GameType;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  durationSeconds: number;
  metadata?: Record<string, any>;
}

interface GameStats {
  totalGamesPlayed: number;
  totalPoints: number;
  perfectScores: number;
  fastGames: number; // games completed under 5 minutes with good scores
  vocabularyGames: number;
  grammarGames: number;
  listeningGames: number;
  readingGames: number;
  bestStreak: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

const ACHIEVEMENT_DEFINITIONS = [
  { id: "first_steps", title: "First Steps", description: "Complete your first game", icon: "🎯", target: 1, field: "totalGamesPlayed" },
  { id: "speed_demon", title: "Speed Demon", description: "Complete 10 fast games", icon: "⚡", target: 10, field: "fastGames" },
  { id: "perfect_score", title: "Perfect Score", description: "Get 100% on any game", icon: "🏆", target: 1, field: "perfectScores" },
  { id: "streak_master", title: "Game Master", description: "Play 30 total games", icon: "🔥", target: 30, field: "totalGamesPlayed" },
  { id: "vocabulary_king", title: "Vocabulary King", description: "Complete 20 vocabulary games", icon: "📚", target: 20, field: "vocabularyGames" },
  { id: "grammar_guru", title: "Grammar Guru", description: "Complete 20 grammar games", icon: "✨", target: 20, field: "grammarGames" },
];

export function useGameProgress() {
  const [isSaving, setIsSaving] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadGameStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Fetch all game sessions for this user
      const { data: sessions, error } = await supabase
        .from("practice_sessions")
        .select("*")
        .eq("user_id", user.id)
        .eq("session_type", "game");

      if (error) {
        console.error("Error loading game stats:", error);
        setIsLoading(false);
        return;
      }

      const stats: GameStats = {
        totalGamesPlayed: sessions?.length || 0,
        totalPoints: 0,
        perfectScores: 0,
        fastGames: 0,
        vocabularyGames: 0,
        grammarGames: 0,
        listeningGames: 0,
        readingGames: 0,
        bestStreak: 0,
      };

      sessions?.forEach((session) => {
        const metadata = session.metadata as Record<string, any> | null;
        const gameType = metadata?.game_type as GameType;
        const score = metadata?.score || 0;
        
        stats.totalPoints += score;
        
        if (session.score_percentage === 100) {
          stats.perfectScores++;
        }
        
        // Fast game: under 5 minutes (300 seconds) with at least 60% score
        if ((session.duration_seconds || 0) < 300 && (session.score_percentage || 0) >= 60) {
          stats.fastGames++;
        }

        switch (gameType) {
          case "vocabulary-race":
            stats.vocabularyGames++;
            break;
          case "grammar-battle":
            stats.grammarGames++;
            break;
          case "listening-puzzle":
            stats.listeningGames++;
            break;
          case "reading-sprint":
            stats.readingGames++;
            break;
        }
      });

      setGameStats(stats);

      // Calculate achievements based on stats
      const achievementsList: Achievement[] = ACHIEVEMENT_DEFINITIONS.map((def) => {
        const currentValue = stats[def.field as keyof GameStats] as number;
        return {
          id: def.id,
          title: def.title,
          description: def.description,
          icon: def.icon,
          unlocked: currentValue >= def.target,
          progress: currentValue,
          target: def.target,
        };
      });

      setAchievements(achievementsList);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading game stats:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGameStats();
  }, []);

  const saveGameSession = async ({
    gameType,
    score,
    totalQuestions,
    correctAnswers,
    durationSeconds,
    metadata = {},
  }: SaveGameParams): Promise<boolean> => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return false;
      }

      // Get any module to satisfy foreign key (we use the game type in metadata)
      const { data: module } = await supabase
        .from("ielts_modules")
        .select("id")
        .limit(1)
        .maybeSingle();

      if (!module) {
        console.error("No modules found");
        return false;
      }

      const scorePercentage = totalQuestions > 0 
        ? Math.round((correctAnswers / totalQuestions) * 100) 
        : 0;

      const { error } = await supabase.from("practice_sessions").insert({
        user_id: user.id,
        module_id: module.id,
        total_questions: totalQuestions,
        answered_questions: totalQuestions,
        correct_answers: correctAnswers,
        duration_seconds: durationSeconds,
        score_percentage: scorePercentage,
        completed_at: new Date().toISOString(),
        session_type: "game",
        metadata: {
          ...metadata,
          game_type: gameType,
          score: score,
        },
      });

      if (error) {
        console.error("Error saving game session:", error);
        return false;
      }

      // Reload stats after saving
      await loadGameStats();
      
      // Check for newly unlocked achievements
      checkNewAchievements();

      return true;
    } catch (error) {
      console.error("Error saving game session:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const checkNewAchievements = () => {
    const newlyUnlocked = achievements.filter(
      (a) => a.unlocked && a.progress === a.target
    );
    
    newlyUnlocked.forEach((achievement) => {
      toast.success(`🏆 Achievement Unlocked: ${achievement.title}!`, {
        description: achievement.description,
      });
    });
  };

  return { 
    saveGameSession, 
    isSaving, 
    gameStats, 
    achievements, 
    isLoading,
    refreshStats: loadGameStats 
  };
}
