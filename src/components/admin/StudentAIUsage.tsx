import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Crown, Zap, BarChart3 } from "lucide-react";

interface AIUsageStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  byType: Record<string, number>;
  isPro: boolean;
}

interface StudentAIUsageProps {
  studentEmail: string;
}

export function StudentAIUsage({ studentEmail }: StudentAIUsageProps) {
  const [stats, setStats] = useState<AIUsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsageStats();
  }, [studentEmail]);

  const loadUsageStats = async () => {
    try {
      // First get the user ID from auth.users via their email
      // We need to query through profiles or student_applications
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", studentEmail)
        .single();

      if (!profile) {
        setStats({
          total: 0,
          today: 0,
          thisWeek: 0,
          thisMonth: 0,
          byType: {},
          isPro: false,
        });
        setIsLoading(false);
        return;
      }

      const userId = profile.id;

      // Get subscription status
      const { data: subscription } = await supabase
        .from("user_subscriptions")
        .select("status")
        .eq("user_id", userId)
        .single();

      const isPro = subscription?.status === "pro";

      // Get usage data
      const now = new Date();
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);
      
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - 7);
      
      const monthStart = new Date(now);
      monthStart.setMonth(monthStart.getMonth() - 1);

      const { data: allUsage } = await supabase
        .from("ai_usage")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!allUsage) {
        setStats({
          total: 0,
          today: 0,
          thisWeek: 0,
          thisMonth: 0,
          byType: {},
          isPro,
        });
        setIsLoading(false);
        return;
      }

      // Calculate stats
      const total = allUsage.length;
      const today = allUsage.filter(u => new Date(u.created_at) >= todayStart).length;
      const thisWeek = allUsage.filter(u => new Date(u.created_at) >= weekStart).length;
      const thisMonth = allUsage.filter(u => new Date(u.created_at) >= monthStart).length;

      const byType: Record<string, number> = {};
      allUsage.forEach(u => {
        byType[u.request_type] = (byType[u.request_type] || 0) + 1;
      });

      setStats({
        total,
        today,
        thisWeek,
        thisMonth,
        byType,
        isPro,
      });
    } catch (error) {
      console.error("Error loading AI usage stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            AI Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  const requestTypeLabels: Record<string, string> = {
    ielts_chat: "AI Study Buddy",
    ielts_feedback: "IELTS Feedback",
    reading: "Reading Practice",
    writing: "Writing Practice",
    listening: "Listening Practice",
    speaking: "Speaking Practice",
    study_advisor: "Study Advisor",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            AI Usage
          </CardTitle>
          {stats.isPro ? (
            <Badge className="bg-primary text-primary-foreground">
              <Crown className="h-3 w-3 mr-1" />
              Pro User
            </Badge>
          ) : (
            <Badge variant="outline">
              <Zap className="h-3 w-3 mr-1" />
              Free Plan
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold">{stats.today}</div>
            <div className="text-xs text-muted-foreground">Today</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold">{stats.thisWeek}</div>
            <div className="text-xs text-muted-foreground">This Week</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold">{stats.thisMonth}</div>
            <div className="text-xs text-muted-foreground">This Month</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">All Time</div>
          </div>
        </div>

        {Object.keys(stats.byType).length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Usage by Type</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.byType)
                .sort(([, a], [, b]) => b - a)
                .map(([type, count]) => (
                  <Badge key={type} variant="secondary">
                    {requestTypeLabels[type] || type}: {count}
                  </Badge>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
