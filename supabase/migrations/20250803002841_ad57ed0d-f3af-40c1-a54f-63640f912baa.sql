-- Corrigir avisos de segurança das funções adicionando search_path

-- Recriar função auto_confirm_user com search_path
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  -- Esta função pode ser usada em conjunto com configurações do Supabase
  -- A confirmação real deve ser feita no dashboard do Supabase
  RETURN NEW;
END;
$$;

-- Recriar função handle_updated_at com search_path
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recriar função handle_new_user com search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = ''
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