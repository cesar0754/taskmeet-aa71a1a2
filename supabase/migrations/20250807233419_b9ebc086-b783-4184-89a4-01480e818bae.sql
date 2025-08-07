-- Fix storage policies for avatar bucket
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;

-- Create correct INSERT policy for avatars
CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);