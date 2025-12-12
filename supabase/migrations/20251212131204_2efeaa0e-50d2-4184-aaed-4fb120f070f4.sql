-- Drop the existing check constraint and add a new one with all goal types
ALTER TABLE public.study_goals DROP CONSTRAINT IF EXISTS study_goals_goal_type_check;

ALTER TABLE public.study_goals ADD CONSTRAINT study_goals_goal_type_check 
CHECK (goal_type IN (
  'target_score', 
  'module_completion', 
  'daily_practice', 
  'exam_date',
  'ielts_score',
  'application_deadline',
  'visa_preparation',
  'scholarship_applications',
  'document_collection',
  'language_practice'
));