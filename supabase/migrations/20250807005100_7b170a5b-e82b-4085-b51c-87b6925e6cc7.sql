-- Criar tabela de convites para membros
CREATE TABLE public.member_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.member_invitations ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view invitations from their organizations" 
ON public.member_invitations 
FOR SELECT 
USING (organization_id IN (
  SELECT organizations.id 
  FROM organizations 
  WHERE organizations.owner_id = auth.uid()
));

CREATE POLICY "Users can create invitations in their organizations" 
ON public.member_invitations 
FOR INSERT 
WITH CHECK (organization_id IN (
  SELECT organizations.id 
  FROM organizations 
  WHERE organizations.owner_id = auth.uid()
));

CREATE POLICY "Users can update invitations in their organizations" 
ON public.member_invitations 
FOR UPDATE 
USING (organization_id IN (
  SELECT organizations.id 
  FROM organizations 
  WHERE organizations.owner_id = auth.uid()
));

CREATE POLICY "Users can delete invitations from their organizations" 
ON public.member_invitations 
FOR DELETE 
USING (organization_id IN (
  SELECT organizations.id 
  FROM organizations 
  WHERE organizations.owner_id = auth.uid()
));

-- Trigger para updated_at
CREATE TRIGGER update_member_invitations_updated_at
  BEFORE UPDATE ON public.member_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger de validação para expires_at
CREATE OR REPLACE FUNCTION validate_invitation_expiry()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.expires_at <= now() THEN
    RAISE EXCEPTION 'Invitation expiry date must be in the future';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_member_invitations_expiry
  BEFORE INSERT OR UPDATE ON public.member_invitations
  FOR EACH ROW
  EXECUTE FUNCTION validate_invitation_expiry();