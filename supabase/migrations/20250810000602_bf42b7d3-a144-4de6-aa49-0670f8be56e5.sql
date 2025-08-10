-- RLS: permitir que membros visualizem organizações às quais pertencem
CREATE POLICY "Members can view organizations they belong to"
ON public.organizations
FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT organization_members.organization_id
    FROM public.organization_members
    WHERE organization_members.user_id = auth.uid()
  )
);

-- RLS: permitir que usuários vejam suas próprias linhas de membresia
CREATE POLICY "Users can view their own membership rows"
ON public.organization_members
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
);
