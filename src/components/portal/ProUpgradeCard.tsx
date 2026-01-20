import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Crown, Zap, Check, Loader2, Sparkles, Infinity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAIUsage } from "@/hooks/useAIUsage";

interface ProUpgradeCardProps {
  stripePriceId?: string;
}

export function ProUpgradeCard({ stripePriceId = "price_pro_monthly" }: ProUpgradeCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isPro, usageCount, dailyLimit, remaining, refreshUsage } = useAIUsage();

  const usagePercentage = Math.min((usageCount / dailyLimit) * 100, 100);

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId: stripePriceId,
          successUrl: `${window.location.origin}/portal?success=true`,
          cancelUrl: `${window.location.origin}/portal?canceled=true`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isPro) {
    return (
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Crown className="h-5 w-5 text-primary" />
              Pro Member
            </CardTitle>
            <Badge className="bg-primary text-primary-foreground">
              <Infinity className="h-3 w-3 mr-1" />
              Unlimited
            </Badge>
          </div>
          <CardDescription>You have unlimited AI usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Enjoy unlimited IELTS practice, AI chat, and all premium features!</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 dark:border-orange-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5 text-orange-500" />
            AI Usage
          </CardTitle>
          <Badge variant="outline" className="border-orange-300 text-orange-700 dark:text-orange-300">
            Free Plan
          </Badge>
        </div>
        <CardDescription>
          {remaining > 0 
            ? `${remaining} AI requests remaining today`
            : "Daily limit reached - Upgrade to continue"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Daily Usage</span>
            <span className="font-medium">{usageCount} / {dailyLimit}</span>
          </div>
          <Progress 
            value={usagePercentage} 
            className={`h-2 ${usagePercentage >= 80 ? "[&>div]:bg-orange-500" : "[&>div]:bg-primary"}`}
          />
        </div>

        <div className="pt-2 border-t">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Crown className="h-4 w-4 text-primary" />
            Upgrade to Pro
          </h4>
          <ul className="space-y-1 text-sm text-muted-foreground mb-4">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Unlimited AI IELTS practice
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Unlimited AI Study Buddy chat
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Priority support
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Advanced analytics
            </li>
          </ul>
          <Button 
            onClick={handleUpgrade} 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
