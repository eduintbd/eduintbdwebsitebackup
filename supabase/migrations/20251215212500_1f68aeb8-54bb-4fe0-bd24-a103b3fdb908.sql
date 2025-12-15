-- Create the student-documents storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('student-documents', 'student-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Policy: Students can upload their own documents (folder named after their user id)
CREATE POLICY "Students can upload own documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'student-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Students can view their own documents
CREATE POLICY "Students can view own documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'student-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Students can delete their own documents
CREATE POLICY "Students can delete own documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'student-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Admins can view all student documents
CREATE POLICY "Admins can view all student documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'student-documents' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Policy: Admins can manage all student documents
CREATE POLICY "Admins can manage all student documents"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'student-documents' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);