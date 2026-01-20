import { Badge } from "@/components/ui/badge";
import { Crown, Zap, AlertTriangle } from "lucide-react";
import { useAIUsage } from "@/hooks/useAIUsage";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AIUsageBadge() {
  const { isPro, remaining, usageCount, dailyLimit, isLoading } = useAIUsage();

  if (isLoading) {
    return null;
  }

  if (isPro) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
              <Crown className="h-3 w-3 mr-1" />
              Pro
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Unlimited AI usage</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const isLow = remaining <= 5;
  const isExhausted = remaining === 0;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge 
            variant="outline" 
            className={`
              ${isExhausted ? "border-destructive text-destructive" : 
                isLow ? "border-orange-500 text-orange-600" : 
                "border-muted-foreground"}
            `}
          >
            {isExhausted ? (
              <AlertTriangle className="h-3 w-3 mr-1" />
            ) : (
              <Zap className="h-3 w-3 mr-1" />
            )}
            {remaining}/{dailyLimit}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isExhausted 
              ? "Daily AI limit reached. Upgrade to Pro for unlimited access!"
              : `${remaining} AI requests remaining today`}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
