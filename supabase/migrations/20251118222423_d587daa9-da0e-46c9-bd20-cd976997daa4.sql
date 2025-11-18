-- Add new optional fields to student_applications table
ALTER TABLE public.student_applications
ADD COLUMN IF NOT EXISTS preferred_course TEXT,
ADD COLUMN IF NOT EXISTS level TEXT,
ADD COLUMN IF NOT EXISTS budget TEXT,
ADD COLUMN IF NOT EXISTS reference_source TEXT;