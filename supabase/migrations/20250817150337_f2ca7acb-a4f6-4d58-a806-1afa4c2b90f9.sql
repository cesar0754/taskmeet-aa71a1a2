-- Corrigir a view task_attachments_with_uploader para ser SECURITY INVOKER
DROP VIEW IF EXISTS public.task_attachments_with_uploader;

CREATE VIEW public.task_attachments_with_uploader
WITH (security_invoker = true)
AS
SELECT 
  ta.id,
  ta.task_id,
  ta.file_name,
  ta.file_path,
  ta.file_type,
  ta.file_size,
  ta.organization_id,
  ta.uploaded_by,
  ta.created_at,
  ta.updated_at,
  p.name as uploader_name,
  p.email as uploader_email
FROM public.task_attachments ta
LEFT JOIN public.profiles p ON ta.uploaded_by = p.user_id;

-- Atualizar função para ter search_path fixo
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Atualizar função handle_new_user para ter search_path fixo
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Atualizar função user_has_org_write_access para ter search_path fixo
CREATE OR REPLACE FUNCTION public.user_has_org_write_access(_org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT (
    -- Dono da organização tem acesso de escrita
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE o.id = _org_id AND o.owner_id = auth.uid()
    )
  ) OR (
    -- Membros com role admin/editor têm acesso de escrita
    EXISTS (
      SELECT 1 FROM public.organization_members m
      WHERE m.organization_id = _org_id
        AND m.user_id = auth.uid()
        AND m.role IN ('admin','editor')
    )
  );
$$;