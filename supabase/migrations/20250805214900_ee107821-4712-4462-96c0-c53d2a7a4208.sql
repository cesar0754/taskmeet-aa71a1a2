-- Criar tabela de reuniões
CREATE TABLE public.meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  meeting_url TEXT,
  organization_id UUID NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de participantes da reunião
CREATE TABLE public.meeting_attendees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID NOT NULL,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(meeting_id, user_id)
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_attendees ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para meetings
CREATE POLICY "Users can view meetings from their organizations" ON public.meetings
FOR SELECT USING (
  organization_id IN (
    SELECT id FROM organizations WHERE owner_id = auth.uid()
  ) OR organization_id IN (
    SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create meetings in their organizations" ON public.meetings
FOR INSERT WITH CHECK (
  organization_id IN (
    SELECT id FROM organizations WHERE owner_id = auth.uid()
  ) OR organization_id IN (
    SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update meetings in their organizations" ON public.meetings
FOR UPDATE USING (
  organization_id IN (
    SELECT id FROM organizations WHERE owner_id = auth.uid()
  ) OR organization_id IN (
    SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete meetings in their organizations" ON public.meetings
FOR DELETE USING (
  organization_id IN (
    SELECT id FROM organizations WHERE owner_id = auth.uid()
  ) OR organization_id IN (
    SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
  )
);

-- Políticas RLS para meeting_attendees
CREATE POLICY "Users can view attendees of meetings from their organizations" ON public.meeting_attendees
FOR SELECT USING (
  meeting_id IN (
    SELECT id FROM meetings WHERE organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    ) OR organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can add attendees to meetings in their organizations" ON public.meeting_attendees
FOR INSERT WITH CHECK (
  meeting_id IN (
    SELECT id FROM meetings WHERE organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    ) OR organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can update attendees of meetings in their organizations" ON public.meeting_attendees
FOR UPDATE USING (
  meeting_id IN (
    SELECT id FROM meetings WHERE organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    ) OR organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can delete attendees from meetings in their organizations" ON public.meeting_attendees
FOR DELETE USING (
  meeting_id IN (
    SELECT id FROM meetings WHERE organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    ) OR organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  )
);

-- Criar índices para performance
CREATE INDEX idx_meetings_organization_id ON public.meetings(organization_id);
CREATE INDEX idx_meetings_created_by ON public.meetings(created_by);
CREATE INDEX idx_meetings_start_time ON public.meetings(start_time);
CREATE INDEX idx_meeting_attendees_meeting_id ON public.meeting_attendees(meeting_id);
CREATE INDEX idx_meeting_attendees_user_id ON public.meeting_attendees(user_id);

-- Trigger para updated_at na tabela meetings
CREATE TRIGGER update_meetings_updated_at
  BEFORE UPDATE ON public.meetings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();