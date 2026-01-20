import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AIUsageData {
  isPro: boolean;
  usageCount: number;
  dailyLimit: number;
  remaining: number;
  canUseAI: boolean;
}

export function useAIUsage() {
  const [usage, setUsage] = useState<AIUsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setUsage({
          isPro: false,
          usageCount: 0,
          dailyLimit: 20,
          remaining: 20,
          canUseAI: true,
        });
        return;
      }

      const { data, error: fnError } = await supabase.functions.invoke("check-ai-usage");

      if (fnError) {
        throw new Error(fnError.message);
      }

      setUsage(data);
    } catch (err) {
      console.error("Error fetching AI usage:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch usage");
      // Default to allowing usage if check fails
      setUsage({
        isPro: false,
        usageCount: 0,
        dailyLimit: 20,
        remaining: 20,
        canUseAI: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  const refreshUsage = useCallback(() => {
    fetchUsage();
  }, [fetchUsage]);

  return {
    usage,
    isLoading,
    error,
    refreshUsage,
    isPro: usage?.isPro ?? false,
    canUseAI: usage?.canUseAI ?? true,
    remaining: usage?.remaining ?? 20,
    usageCount: usage?.usageCount ?? 0,
    dailyLimit: usage?.dailyLimit ?? 20,
  };
}
