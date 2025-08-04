-- Primeiro, remover todas as políticas problemáticas
DROP POLICY IF EXISTS "Users can view organizations they own or are members of" ON public.organizations;
DROP POLICY IF EXISTS "Users can create their own organizations" ON public.organizations;
DROP POLICY IF EXISTS "Organization owners can update their organizations" ON public.organizations;
DROP POLICY IF EXISTS "Organization owners can delete their organizations" ON public.organizations;

DROP POLICY IF EXISTS "Users can view members of organizations they belong to" ON public.organization_members;
DROP POLICY IF EXISTS "Organization owners can add members" ON public.organization_members;
DROP POLICY IF EXISTS "Organization owners can update members" ON public.organization_members;
DROP POLICY IF EXISTS "Organization owners can remove members" ON public.organization_members;

-- Criar políticas mais simples sem recursão para organizations
CREATE POLICY "Users can view their own organizations" 
ON public.organizations 
FOR SELECT 
USING (owner_id = auth.uid());

CREATE POLICY "Users can create organizations" 
ON public.organizations 
FOR INSERT 
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own organizations" 
ON public.organizations 
FOR UPDATE 
USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own organizations" 
ON public.organizations 
FOR DELETE 
USING (owner_id = auth.uid());

-- Criar políticas simples para organization_members
CREATE POLICY "Users can view members of their organizations" 
ON public.organization_members 
FOR SELECT 
USING (
  organization_id IN (
    SELECT id FROM public.organizations WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Users can add members to their organizations" 
ON public.organization_members 
FOR INSERT 
WITH CHECK (
  organization_id IN (
    SELECT id FROM public.organizations WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Users can update members of their organizations" 
ON public.organization_members 
FOR UPDATE 
USING (
  organization_id IN (
    SELECT id FROM public.organizations WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Users can delete members from their organizations" 
ON public.organization_members 
FOR DELETE 
USING (
  organization_id IN (
    SELECT id FROM public.organizations WHERE owner_id = auth.uid()
  )
);