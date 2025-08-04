-- Criar tabela de organizações
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de membros das organizações
CREATE TABLE public.organization_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para organizations
CREATE POLICY "Users can view organizations they own or are members of" 
ON public.organizations 
FOR SELECT 
USING (
  owner_id = auth.uid() OR 
  id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create their own organizations" 
ON public.organizations 
FOR INSERT 
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Organization owners can update their organizations" 
ON public.organizations 
FOR UPDATE 
USING (owner_id = auth.uid());

CREATE POLICY "Organization owners can delete their organizations" 
ON public.organizations 
FOR DELETE 
USING (owner_id = auth.uid());

-- Políticas RLS para organization_members
CREATE POLICY "Users can view members of organizations they belong to" 
ON public.organization_members 
FOR SELECT 
USING (
  organization_id IN (
    SELECT id 
    FROM public.organizations 
    WHERE owner_id = auth.uid()
  ) OR
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Organization owners can add members" 
ON public.organization_members 
FOR INSERT 
WITH CHECK (
  organization_id IN (
    SELECT id 
    FROM public.organizations 
    WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Organization owners can update members" 
ON public.organization_members 
FOR UPDATE 
USING (
  organization_id IN (
    SELECT id 
    FROM public.organizations 
    WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Organization owners can remove members" 
ON public.organization_members 
FOR DELETE 
USING (
  organization_id IN (
    SELECT id 
    FROM public.organizations 
    WHERE owner_id = auth.uid()
  )
);

-- Criar triggers para updated_at
CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_organization_members_updated_at
BEFORE UPDATE ON public.organization_members
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();