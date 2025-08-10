-- 1) Enum para roles padronizados e ajustes na coluna role
DO $$ BEGIN
  CREATE TYPE public.organization_role AS ENUM ('admin','editor','viewer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Normalizar valores existentes para o conjunto novo
UPDATE public.organization_members
SET role = 'viewer'
WHERE role NOT IN ('admin','editor','viewer');

-- Ajustar default e tipo da coluna role para o enum
ALTER TABLE public.organization_members ALTER COLUMN role DROP DEFAULT;
ALTER TABLE public.organization_members
  ALTER COLUMN role TYPE public.organization_role
  USING (
    CASE role
      WHEN 'admin' THEN 'admin'::public.organization_role
      WHEN 'editor' THEN 'editor'::public.organization_role
      WHEN 'viewer' THEN 'viewer'::public.organization_role
      ELSE 'viewer'::public.organization_role
    END
  );
ALTER TABLE public.organization_members ALTER COLUMN role SET DEFAULT 'viewer';

-- 2) Adicionar coluna owner_member_id para diferenciar posse de nível de acesso
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS owner_member_id uuid;

-- Preencher owner_member_id com a linha de membresia do dono quando existir
UPDATE public.organizations o
SET owner_member_id = om.id
FROM public.organization_members om
WHERE om.organization_id = o.id
  AND om.user_id = o.owner_id
  AND o.owner_member_id IS NULL;

-- Chave estrangeira (idempotente)
DO $$ BEGIN
  ALTER TABLE public.organizations
    ADD CONSTRAINT organizations_owner_member_fk
    FOREIGN KEY (owner_member_id)
    REFERENCES public.organization_members(id)
    ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3) Função helper para verificar permissão de escrita por organização
CREATE OR REPLACE FUNCTION public.user_has_org_write_access(_org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
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

-- 4) Atualizar políticas RLS de escrita para usar roles (editor/admin)
-- GROUPS
DO $$ BEGIN
  -- Remover políticas antigas de escrita se existirem
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='groups' AND policyname='Users can create groups in their organizations'
  ) THEN
    DROP POLICY "Users can create groups in their organizations" ON public.groups;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='groups' AND policyname='Users can update groups in their organizations'
  ) THEN
    DROP POLICY "Users can update groups in their organizations" ON public.groups;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='groups' AND policyname='Users can delete groups in their organizations'
  ) THEN
    DROP POLICY "Users can delete groups in their organizations" ON public.groups;
  END IF;

  -- Criar políticas baseadas em role
  CREATE POLICY "Users with write access can create groups"
  ON public.groups
  FOR INSERT
  TO authenticated
  WITH CHECK (public.user_has_org_write_access(organization_id));

  CREATE POLICY "Users with write access can update groups"
  ON public.groups
  FOR UPDATE
  TO authenticated
  USING (public.user_has_org_write_access(organization_id));

  CREATE POLICY "Users with write access can delete groups"
  ON public.groups
  FOR DELETE
  TO authenticated
  USING (public.user_has_org_write_access(organization_id));
END $$;

-- TASKS
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tasks' AND policyname='Users can create tasks in their organizations'
  ) THEN
    DROP POLICY "Users can create tasks in their organizations" ON public.tasks;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tasks' AND policyname='Users can update tasks in their organizations'
  ) THEN
    DROP POLICY "Users can update tasks in their organizations" ON public.tasks;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tasks' AND policyname='Users can delete tasks in their organizations'
  ) THEN
    DROP POLICY "Users can delete tasks in their organizations" ON public.tasks;
  END IF;

  CREATE POLICY "Users with write access can create tasks"
  ON public.tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (public.user_has_org_write_access(organization_id));

  CREATE POLICY "Users with write access can update tasks"
  ON public.tasks
  FOR UPDATE
  TO authenticated
  USING (public.user_has_org_write_access(organization_id));

  CREATE POLICY "Users with write access can delete tasks"
  ON public.tasks
  FOR DELETE
  TO authenticated
  USING (public.user_has_org_write_access(organization_id));
END $$;

-- MEETINGS
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='meetings' AND policyname='Users can create meetings in their organizations'
  ) THEN
    DROP POLICY "Users can create meetings in their organizations" ON public.meetings;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='meetings' AND policyname='Users can update meetings in their organizations'
  ) THEN
    DROP POLICY "Users can update meetings in their organizations" ON public.meetings;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='meetings' AND policyname='Users can delete meetings in their organizations'
  ) THEN
    DROP POLICY "Users can delete meetings in their organizations" ON public.meetings;
  END IF;

  CREATE POLICY "Users with write access can create meetings"
  ON public.meetings
  FOR INSERT
  TO authenticated
  WITH CHECK (public.user_has_org_write_access(organization_id));

  CREATE POLICY "Users with write access can update meetings"
  ON public.meetings
  FOR UPDATE
  TO authenticated
  USING (public.user_has_org_write_access(organization_id));

  CREATE POLICY "Users with write access can delete meetings"
  ON public.meetings
  FOR DELETE
  TO authenticated
  USING (public.user_has_org_write_access(organization_id));
END $$;

-- TASK_ASSIGNEES
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='task_assignees' AND policyname='Users can add task assignees in their organizations'
  ) THEN
    DROP POLICY "Users can add task assignees in their organizations" ON public.task_assignees;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='task_assignees' AND policyname='Users can update task assignees in their organizations'
  ) THEN
    DROP POLICY "Users can update task assignees in their organizations" ON public.task_assignees;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='task_assignees' AND policyname='Users can delete task assignees from their organizations'
  ) THEN
    DROP POLICY "Users can delete task assignees from their organizations" ON public.task_assignees;
  END IF;

  CREATE POLICY "Users with write access can add task assignees"
  ON public.task_assignees
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.user_has_org_write_access(
      (SELECT t.organization_id FROM public.tasks t WHERE t.id = task_id)
    )
  );

  CREATE POLICY "Users with write access can update task assignees"
  ON public.task_assignees
  FOR UPDATE
  TO authenticated
  USING (
    public.user_has_org_write_access(
      (SELECT t.organization_id FROM public.tasks t WHERE t.id = task_id)
    )
  );

  CREATE POLICY "Users with write access can delete task assignees"
  ON public.task_assignees
  FOR DELETE
  TO authenticated
  USING (
    public.user_has_org_write_access(
      (SELECT t.organization_id FROM public.tasks t WHERE t.id = task_id)
    )
  );
END $$;

-- MEETING_ATTENDEES
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='meeting_attendees' AND policyname='Users can add attendees to meetings in their organizations'
  ) THEN
    DROP POLICY "Users can add attendees to meetings in their organizations" ON public.meeting_attendees;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='meeting_attendees' AND policyname='Users can update attendees of meetings in their organizations'
  ) THEN
    DROP POLICY "Users can update attendees of meetings in their organizations" ON public.meeting_attendees;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='meeting_attendees' AND policyname='Users can delete attendees from meetings in their organizations'
  ) THEN
    DROP POLICY "Users can delete attendees from meetings in their organizations" ON public.meeting_attendees;
  END IF;

  CREATE POLICY "Users with write access can add meeting attendees"
  ON public.meeting_attendees
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.user_has_org_write_access(
      (SELECT m.organization_id FROM public.meetings m WHERE m.id = meeting_id)
    )
  );

  CREATE POLICY "Users with write access can update meeting attendees"
  ON public.meeting_attendees
  FOR UPDATE
  TO authenticated
  USING (
    public.user_has_org_write_access(
      (SELECT m.organization_id FROM public.meetings m WHERE m.id = meeting_id)
    )
  );

  CREATE POLICY "Users with write access can delete meeting attendees"
  ON public.meeting_attendees
  FOR DELETE
  TO authenticated
  USING (
    public.user_has_org_write_access(
      (SELECT m.organization_id FROM public.meetings m WHERE m.id = meeting_id)
    )
  );
END $$;
