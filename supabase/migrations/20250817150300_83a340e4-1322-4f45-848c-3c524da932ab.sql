-- Habilitar RLS nas tabelas que não estão com RLS ativado
ALTER TABLE public.task_attachments_with_uploader ENABLE ROW LEVEL SECURITY;

-- Verificar se há outras tabelas sem RLS e habilitá-las se necessário
-- Esta é uma consulta para garantir que todas as tabelas públicas tenham RLS ativado

-- Criar uma view SECURITY INVOKER ao invés de SECURITY DEFINER para task_attachments_with_uploader
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