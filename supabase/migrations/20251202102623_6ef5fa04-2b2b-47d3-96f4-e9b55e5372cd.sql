-- ============================================================
-- PHASE 1: IELTS Learning Enhancement - Data Persistence & Analytics
-- ============================================================

-- 1. SESSION HISTORY TRACKING
-- Store each practice attempt separately for historical analytics
CREATE TABLE IF NOT EXISTS public.practice_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES public.ielts_modules(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  total_questions INTEGER NOT NULL,
  answered_questions INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  score_percentage NUMERIC(5,2),
  session_type TEXT CHECK (session_type IN ('practice', 'timed_test', 'review')) DEFAULT 'practice',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for practice_sessions
CREATE POLICY "Users can view own practice sessions"
  ON public.practice_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own practice sessions"
  ON public.practice_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own practice sessions"
  ON public.practice_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_practice_sessions_user_id ON public.practice_sessions(user_id);
CREATE INDEX idx_practice_sessions_module_id ON public.practice_sessions(module_id);
CREATE INDEX idx_practice_sessions_started_at ON public.practice_sessions(started_at DESC);

-- 2. STUDY PLANNER - STUDY GOALS
CREATE TABLE IF NOT EXISTS public.study_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  goal_type TEXT CHECK (goal_type IN ('target_score', 'module_completion', 'daily_practice', 'exam_date')) NOT NULL,
  target_value NUMERIC,
  target_date DATE,
  module_type TEXT CHECK (module_type IN ('reading', 'writing', 'listening', 'speaking')),
  status TEXT CHECK (status IN ('active', 'completed', 'abandoned')) DEFAULT 'active',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.study_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for study_goals
CREATE POLICY "Users can manage own study goals"
  ON public.study_goals FOR ALL
  USING (auth.uid() = user_id);

-- 3. STUDY PLANNER - STUDY SCHEDULE
CREATE TABLE IF NOT EXISTS public.study_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  goal_id UUID REFERENCES public.study_goals(id) ON DELETE SET NULL,
  module_id UUID REFERENCES public.ielts_modules(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  duration_minutes INTEGER DEFAULT 30,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.study_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for study_schedules
CREATE POLICY "Users can manage own study schedules"
  ON public.study_schedules FOR ALL
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_study_schedules_user_id ON public.study_schedules(user_id);
CREATE INDEX idx_study_schedules_scheduled_date ON public.study_schedules(scheduled_date);

-- 4. ANALYTICS VIEW - USER PERFORMANCE SUMMARY
CREATE OR REPLACE VIEW public.user_performance_analytics AS
SELECT 
  ps.user_id,
  COUNT(DISTINCT ps.id) as total_sessions,
  COUNT(DISTINCT ps.module_id) as unique_modules_attempted,
  COUNT(DISTINCT DATE(ps.started_at)) as active_days,
  AVG(ps.score_percentage) as avg_score,
  MAX(ps.score_percentage) as best_score,
  SUM(ps.duration_seconds) as total_study_time_seconds,
  SUM(ps.answered_questions) as total_questions_attempted,
  SUM(ps.correct_answers) as total_correct_answers,
  MAX(ps.started_at) as last_practice_date,
  DATE_PART('day', NOW() - MAX(ps.started_at)) as days_since_last_practice
FROM public.practice_sessions ps
WHERE ps.completed_at IS NOT NULL
GROUP BY ps.user_id;

-- 5. ANALYTICS VIEW - MODULE PERFORMANCE BY TYPE
CREATE OR REPLACE VIEW public.module_performance_by_type AS
SELECT 
  ps.user_id,
  m.module_type,
  COUNT(ps.id) as attempts,
  AVG(ps.score_percentage) as avg_score,
  MAX(ps.score_percentage) as best_score,
  MIN(ps.score_percentage) as lowest_score,
  AVG(ps.duration_seconds) as avg_duration_seconds,
  MAX(ps.started_at) as last_attempt_date
FROM public.practice_sessions ps
JOIN public.ielts_modules m ON ps.module_id = m.id
WHERE ps.completed_at IS NOT NULL
GROUP BY ps.user_id, m.module_type;

-- 6. SEED IELTS MODULES (Sample Data)
INSERT INTO public.ielts_modules (title, description, module_type, difficulty, order_index, content) VALUES
  ('IELTS Reading: Academic Passages', 'Practice reading comprehension with academic texts', 'reading', 'intermediate', 1, '{}'::jsonb),
  ('IELTS Writing Task 1: Data Description', 'Learn to describe graphs, charts, and diagrams', 'writing', 'intermediate', 2, '{}'::jsonb),
  ('IELTS Writing Task 2: Essay Writing', 'Master essay structure and argumentation', 'writing', 'advanced', 3, '{}'::jsonb),
  ('IELTS Listening: Conversations', 'Practice listening to everyday conversations', 'listening', 'beginner', 4, '{}'::jsonb),
  ('IELTS Speaking Part 1: Introduction', 'Practice answering personal questions', 'speaking', 'beginner', 5, '{}'::jsonb),
  ('IELTS Speaking Part 2: Cue Card', 'Develop 2-minute speaking skills', 'speaking', 'intermediate', 6, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 7. UPDATE TRIGGER FOR study_goals
CREATE OR REPLACE FUNCTION public.update_study_goal_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_study_goals_updated_at
  BEFORE UPDATE ON public.study_goals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_study_goal_timestamp();

-- 8. FUNCTION: Calculate User's Current Streak
CREATE OR REPLACE FUNCTION public.calculate_study_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_streak INTEGER := 0;
  v_check_date DATE := CURRENT_DATE;
  v_has_session BOOLEAN;
BEGIN
  LOOP
    SELECT EXISTS(
      SELECT 1 FROM public.practice_sessions
      WHERE user_id = p_user_id
        AND DATE(started_at) = v_check_date
        AND completed_at IS NOT NULL
    ) INTO v_has_session;
    
    IF NOT v_has_session THEN
      EXIT;
    END IF;
    
    v_streak := v_streak + 1;
    v_check_date := v_check_date - INTERVAL '1 day';
  END LOOP;
  
  RETURN v_streak;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- 9. FUNCTION: Get Weekly Progress Summary
CREATE OR REPLACE FUNCTION public.get_weekly_progress(p_user_id UUID)
RETURNS TABLE(
  week_start DATE,
  sessions_count INTEGER,
  avg_score NUMERIC,
  total_time_minutes INTEGER,
  modules_completed INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE_TRUNC('week', ps.started_at)::DATE as week_start,
    COUNT(ps.id)::INTEGER as sessions_count,
    ROUND(AVG(ps.score_percentage), 2) as avg_score,
    (SUM(ps.duration_seconds) / 60)::INTEGER as total_time_minutes,
    COUNT(DISTINCT ps.module_id)::INTEGER as modules_completed
  FROM public.practice_sessions ps
  WHERE ps.user_id = p_user_id
    AND ps.completed_at IS NOT NULL
    AND ps.started_at >= NOW() - INTERVAL '12 weeks'
  GROUP BY DATE_TRUNC('week', ps.started_at)
  ORDER BY week_start DESC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;