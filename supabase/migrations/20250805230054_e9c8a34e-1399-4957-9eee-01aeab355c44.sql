-- Criar tabela para múltiplos responsáveis por tarefa
CREATE TABLE public.task_assignees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(task_id, user_id)
);

-- Habilitar RLS
ALTER TABLE public.task_assignees ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para task_assignees
CREATE POLICY "Users can view task assignees from their organizations" 
ON public.task_assignees 
FOR SELECT 
USING (
  task_id IN (
    SELECT tasks.id FROM tasks 
    WHERE (
      (tasks.organization_id IN (
        SELECT organizations.id FROM organizations 
        WHERE organizations.owner_id = auth.uid()
      )) 
      OR 
      (tasks.organization_id IN (
        SELECT organization_members.organization_id FROM organization_members 
        WHERE organization_members.user_id = auth.uid()
      ))
    )
  )
);

CREATE POLICY "Users can add task assignees in their organizations" 
ON public.task_assignees 
FOR INSERT 
WITH CHECK (
  task_id IN (
    SELECT tasks.id FROM tasks 
    WHERE (
      (tasks.organization_id IN (
        SELECT organizations.id FROM organizations 
        WHERE organizations.owner_id = auth.uid()
      )) 
      OR 
      (tasks.organization_id IN (
        SELECT organization_members.organization_id FROM organization_members 
        WHERE organization_members.user_id = auth.uid()
      ))
    )
  )
);

CREATE POLICY "Users can update task assignees in their organizations" 
ON public.task_assignees 
FOR UPDATE 
USING (
  task_id IN (
    SELECT tasks.id FROM tasks 
    WHERE (
      (tasks.organization_id IN (
        SELECT organizations.id FROM organizations 
        WHERE organizations.owner_id = auth.uid()
      )) 
      OR 
      (tasks.organization_id IN (
        SELECT organization_members.organization_id FROM organization_members 
        WHERE organization_members.user_id = auth.uid()
      ))
    )
  )
);

CREATE POLICY "Users can delete task assignees from their organizations" 
ON public.task_assignees 
FOR DELETE 
USING (
  task_id IN (
    SELECT tasks.id FROM tasks 
    WHERE (
      (tasks.organization_id IN (
        SELECT organizations.id FROM organizations 
        WHERE organizations.owner_id = auth.uid()
      )) 
      OR 
      (tasks.organization_id IN (
        SELECT organization_members.organization_id FROM organization_members 
        WHERE organization_members.user_id = auth.uid()
      ))
    )
  )
);

-- Migrar dados existentes da coluna assigned_to para a nova tabela
INSERT INTO public.task_assignees (task_id, user_id)
SELECT id, assigned_to 
FROM public.tasks 
WHERE assigned_to IS NOT NULL;