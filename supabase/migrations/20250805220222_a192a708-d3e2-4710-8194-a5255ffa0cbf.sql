-- Criar tabela de grupos
CREATE TABLE public.groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  organization_id UUID NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de membros do grupo
CREATE TABLE public.group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL,
  member_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, member_id)
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para groups
CREATE POLICY "Users can view groups from their organizations" ON public.groups
FOR SELECT USING (
  organization_id IN (
    SELECT id FROM organizations WHERE owner_id = auth.uid()
  ) OR organization_id IN (
    SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create groups in their organizations" ON public.groups
FOR INSERT WITH CHECK (
  organization_id IN (
    SELECT id FROM organizations WHERE owner_id = auth.uid()
  ) OR organization_id IN (
    SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update groups in their organizations" ON public.groups
FOR UPDATE USING (
  organization_id IN (
    SELECT id FROM organizations WHERE owner_id = auth.uid()
  ) OR organization_id IN (
    SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete groups in their organizations" ON public.groups
FOR DELETE USING (
  organization_id IN (
    SELECT id FROM organizations WHERE owner_id = auth.uid()
  ) OR organization_id IN (
    SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
  )
);

-- Políticas RLS para group_members
CREATE POLICY "Users can view group members from their organizations" ON public.group_members
FOR SELECT USING (
  group_id IN (
    SELECT id FROM groups WHERE organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    ) OR organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can add group members in their organizations" ON public.group_members
FOR INSERT WITH CHECK (
  group_id IN (
    SELECT id FROM groups WHERE organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    ) OR organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can update group members in their organizations" ON public.group_members
FOR UPDATE USING (
  group_id IN (
    SELECT id FROM groups WHERE organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    ) OR organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can delete group members from their organizations" ON public.group_members
FOR DELETE USING (
  group_id IN (
    SELECT id FROM groups WHERE organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    ) OR organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  )
);

-- Criar índices para performance
CREATE INDEX idx_groups_organization_id ON public.groups(organization_id);
CREATE INDEX idx_groups_created_by ON public.groups(created_by);
CREATE INDEX idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX idx_group_members_member_id ON public.group_members(member_id);

-- Trigger para updated_at na tabela groups
CREATE TRIGGER update_groups_updated_at
  BEFORE UPDATE ON public.groups
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();