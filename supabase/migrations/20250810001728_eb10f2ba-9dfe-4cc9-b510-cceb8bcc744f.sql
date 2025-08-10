-- Migração idempotente: cria políticas apenas se não existirem

-- Members can view organizations they belong to
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'organizations'
      AND policyname = 'Members can view organizations they belong to'
  ) THEN
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
  END IF;
END $$;

-- Users can view their own membership rows
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'organization_members'
      AND policyname = 'Users can view their own membership rows'
  ) THEN
    CREATE POLICY "Users can view their own membership rows"
    ON public.organization_members
    FOR SELECT
    TO authenticated
    USING (
      user_id = auth.uid()
    );
  END IF;
END $$;