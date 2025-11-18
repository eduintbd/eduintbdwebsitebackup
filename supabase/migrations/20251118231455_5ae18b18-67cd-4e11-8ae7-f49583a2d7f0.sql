-- Fix critical quiz answer exposure
-- Create a safe view that hides correct answers until after submission
CREATE OR REPLACE VIEW public.quiz_questions_safe AS
SELECT 
  id,
  module_id,
  question_text,
  question_type,
  options,
  points,
  created_at
FROM public.quiz_questions;

-- Grant access to the safe view
GRANT SELECT ON public.quiz_questions_safe TO authenticated, anon;

-- Create audit logs table for admin action tracking
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  details jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- System can insert audit logs
CREATE POLICY "System can insert audit logs"
ON public.audit_logs
FOR INSERT
WITH CHECK (true);

-- Add email verification fields to student_applications
ALTER TABLE public.student_applications 
ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS verification_token text,
ADD COLUMN IF NOT EXISTS verified_at timestamptz;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_student_applications_verification_token ON public.student_applications(verification_token) WHERE verification_token IS NOT NULL;