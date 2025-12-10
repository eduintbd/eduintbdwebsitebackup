import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SaveSessionParams {
  moduleType: "reading" | "writing" | "listening" | "speaking";
  totalQuestions: number;
  correctAnswers: number;
  durationSeconds: number;
  metadata?: Record<string, any>;
}

export function useSavePracticeSession() {
  const [isSaving, setIsSaving] = useState(false);

  const saveSession = async ({
    moduleType,
    totalQuestions,
    correctAnswers,
    durationSeconds,
    metadata = {},
  }: SaveSessionParams): Promise<boolean> => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // User not logged in - don't save but don't show error
        return false;
      }

      // Get the module ID for this type
      const { data: module } = await supabase
        .from("ielts_modules")
        .select("id")
        .eq("module_type", moduleType)
        .limit(1)
        .maybeSingle();

      if (!module) {
        console.error("Module not found for type:", moduleType);
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
        session_type: "practice",
        metadata: {
          ...metadata,
          module_type: moduleType,
        },
      });

      if (error) {
        console.error("Error saving session:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error saving practice session:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveSession, isSaving };
}
