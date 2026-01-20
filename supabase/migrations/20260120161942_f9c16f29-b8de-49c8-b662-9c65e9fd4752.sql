-- Create AI usage tracking table
CREATE TABLE public.ai_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  request_type TEXT NOT NULL, -- 'ielts_chat', 'ielts_feedback', 'reading', 'writing', 'listening', 'speaking', 'study_advisor'
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient daily usage queries
CREATE INDEX idx_ai_usage_user_date ON public.ai_usage (user_id, created_at);

-- Enable RLS
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;

-- Users can view their own usage
CREATE POLICY "Users can view own usage"
ON public.ai_usage
FOR SELECT
USING (auth.uid() = user_id);

-- System can insert usage (via edge functions)
CREATE POLICY "System can insert usage"
ON public.ai_usage
FOR INSERT
WITH CHECK (true);

-- Admins can view all usage
CREATE POLICY "Admins can view all usage"
ON public.ai_usage
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create subscriptions table for Pro users
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'free', -- 'free', 'pro', 'cancelled'
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view own subscription
CREATE POLICY "Users can view own subscription"
ON public.user_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

-- System can manage subscriptions (via edge functions)
CREATE POLICY "System can insert subscriptions"
ON public.user_subscriptions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "System can update subscriptions"
ON public.user_subscriptions
FOR UPDATE
USING (true);

-- Admins can view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
ON public.user_subscriptions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to get daily usage count
CREATE OR REPLACE FUNCTION public.get_daily_ai_usage(p_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(COUNT(*)::INTEGER, 0)
  FROM public.ai_usage
  WHERE user_id = p_user_id
    AND created_at >= CURRENT_DATE
    AND created_at < CURRENT_DATE + INTERVAL '1 day'
$$;

-- Create function to check if user is Pro
CREATE OR REPLACE FUNCTION public.is_pro_user(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_subscriptions
    WHERE user_id = p_user_id
      AND status = 'pro'
      AND (current_period_end IS NULL OR current_period_end > NOW())
  )
$$;

-- Add trigger for updated_at on subscriptions
CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.user_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();