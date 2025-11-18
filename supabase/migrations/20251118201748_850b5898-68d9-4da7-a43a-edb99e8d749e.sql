-- Allow anonymous users to view IELTS modules and questions
-- This makes IELTS learning tools free for everyone

-- Drop existing restrictive policies on ielts_modules
DROP POLICY IF EXISTS "Anyone can view modules" ON public.ielts_modules;

-- Create new policy allowing public access to modules
CREATE POLICY "Public can view modules"
ON public.ielts_modules
FOR SELECT
TO anon, authenticated
USING (true);

-- Drop existing restrictive policies on quiz_questions
DROP POLICY IF EXISTS "Authenticated users can view questions" ON public.quiz_questions;

-- Create new policy allowing public access to questions
CREATE POLICY "Public can view questions"
ON public.quiz_questions
FOR SELECT
TO anon, authenticated
USING (true);

-- Keep progression tracking features restricted to authenticated users
-- (user_progress, quiz_attempts, achievements, problem_areas already have proper RLS)