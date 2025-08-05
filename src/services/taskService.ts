import { supabase } from '@/integrations/supabase/client';
import { Task, TaskCreateRequest, TaskUpdateRequest } from '@/types/task';
import { notificationService } from './notificationService';

export async function fetchTasks(organizationId: string): Promise<Task[]> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Buscar assignees para todas as tarefas
    const tasksWithAssignees = await Promise.all(
      (data || []).map(async (task) => {
        // Buscar todos os assignees da tarefa
        const { data: assigneesData } = await supabase
          .from('task_assignees')
          .select('*')
          .eq('task_id', task.id);

        // Buscar dados dos membros para cada assignee
        const assigneesWithMembers = await Promise.all(
          (assigneesData || []).map(async (assignee) => {
            const { data: memberData } = await supabase
              .from('organization_members')
              .select('name, email')
              .eq('user_id', assignee.user_id)
              .single();
            
            return {
              ...assignee,
              member: memberData
            };
          })
        );

        return {
          ...task,
          assignees: assigneesWithMembers,
          // Manter compatibilidade com código antigo
          assigned_to: assigneesWithMembers.length > 0 ? assigneesWithMembers[0].user_id : undefined,
          assigned_member: assigneesWithMembers.length > 0 ? assigneesWithMembers[0].member : undefined
        } as Task;
      })
    );
    
    return tasksWithAssignees;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

export async function createTask(
  task: TaskCreateRequest,
  organizationId: string,
  userId: string
): Promise<Task> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: task.title,
        description: task.description,
        priority: task.priority,
        due_date: task.due_date,
        organization_id: organizationId,
        created_by: userId,
        // Manter assigned_to para compatibilidade, mas usar o primeiro assignee se existir
        assigned_to: task.assignee_ids && task.assignee_ids.length > 0 ? task.assignee_ids[0] : task.assigned_to,
      })
      .select()
      .single();

    if (error) throw error;

    // Adicionar assignees se especificados
    const assigneeIds = task.assignee_ids || (task.assigned_to ? [task.assigned_to] : []);
    if (assigneeIds.length > 0) {
      const assigneesData = assigneeIds.map(assigneeId => ({
        task_id: data.id,
        user_id: assigneeId
      }));

      const { error: assigneesError } = await supabase
        .from('task_assignees')
        .insert(assigneesData);

      if (assigneesError) {
        console.error('Error adding task assignees:', assigneesError);
        // Não falha a criação da tarefa se os assignees falharem
      }
    }

    // Buscar dados completos da tarefa com assignees
    const taskWithAssignees = await fetchTaskById(data.id);

    // Criar notificações para todos os assignees (exceto o criador)
    if (assigneeIds.length > 0) {
      try {
        for (const assigneeId of assigneeIds) {
          if (assigneeId !== userId) {
            console.log('Criando notificação para responsável:', assigneeId);
            await notificationService.createNotification({
              user_id: assigneeId,
              organization_id: organizationId,
              title: `Nova tarefa atribuída: ${data.title}`,
              message: data.description || `Você recebeu uma nova tarefa para completar.`,
              type: 'task',
              action_url: '/tasks'
            });
          }
        }
        console.log('Notificações criadas com sucesso');
      } catch (notificationError) {
        console.error('Error creating task notifications:', notificationError);
      }
    } else {
      console.log('Notificação não enviada - tarefa não atribuída');
    }

    return taskWithAssignees || data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

export async function updateTask(
  taskId: string,
  updates: TaskUpdateRequest
): Promise<Task> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        title: updates.title,
        description: updates.description,
        status: updates.status,
        priority: updates.priority,
        due_date: updates.due_date,
        // Atualizar assigned_to apenas para compatibilidade
        assigned_to: updates.assignee_ids && updates.assignee_ids.length > 0 ? updates.assignee_ids[0] : updates.assigned_to,
      })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;

    // Atualizar assignees se especificados
    const assigneeIds = updates.assignee_ids || (updates.assigned_to ? [updates.assigned_to] : undefined);
    if (assigneeIds !== undefined) {
      // Remover assignees existentes
      await supabase
        .from('task_assignees')
        .delete()
        .eq('task_id', taskId);

      // Adicionar novos assignees
      if (assigneeIds.length > 0) {
        const assigneesData = assigneeIds.map(assigneeId => ({
          task_id: taskId,
          user_id: assigneeId
        }));

        const { error: assigneesError } = await supabase
          .from('task_assignees')
          .insert(assigneesData);

        if (assigneesError) {
          console.error('Error updating task assignees:', assigneesError);
        }
      }
    }

    // Buscar dados completos da tarefa com assignees
    const taskWithAssignees = await fetchTaskById(data.id);

    // Criar notificações para assignees atualizados (exceto o usuário atual)
    if (assigneeIds && assigneeIds.length > 0) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        for (const assigneeId of assigneeIds) {
          if (user && assigneeId !== user.id) {
            console.log('Criando notificação para reatribuição:', assigneeId);
            await notificationService.createNotification({
              user_id: assigneeId,
              organization_id: data.organization_id,
              title: `Tarefa atualizada: ${data.title}`,
              message: `A tarefa "${data.title}" foi atualizada.`,
              type: 'task',
              action_url: '/tasks'
            });
          }
        }
        console.log('Notificações de reatribuição criadas com sucesso');
      } catch (notificationError) {
        console.error('Error creating task update notifications:', notificationError);
      }
    } else {
      console.log('Notificação não enviada - tarefa não foi reatribuída');
    }

    return taskWithAssignees || data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
}

export async function deleteTask(taskId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}

// Função auxiliar para buscar uma tarefa por ID com todos os assignees
async function fetchTaskById(taskId: string): Promise<Task | null> {
  try {
    const { data: taskData, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (taskError || !taskData) return null;

    // Buscar assignees
    const { data: assigneesData } = await supabase
      .from('task_assignees')
      .select('*')
      .eq('task_id', taskId);

    // Buscar dados dos membros para cada assignee
    const assigneesWithMembers = await Promise.all(
      (assigneesData || []).map(async (assignee) => {
        const { data: memberData } = await supabase
          .from('organization_members')
          .select('name, email')
          .eq('user_id', assignee.user_id)
          .single();
        
        return {
          ...assignee,
          member: memberData
        };
      })
    );

    return {
      ...taskData,
      assignees: assigneesWithMembers,
      assigned_to: assigneesWithMembers.length > 0 ? assigneesWithMembers[0].user_id : undefined,
      assigned_member: assigneesWithMembers.length > 0 ? assigneesWithMembers[0].member : undefined
    } as Task;
  } catch (error) {
    console.error('Error fetching task by id:', error);
    return null;
  }
}