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
    return data || [];
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
        ...task,
        organization_id: organizationId,
        created_by: userId,
      })
      .select()
      .single();

    if (error) throw error;

    // Criar notificação se a tarefa foi atribuída a alguém
    if (data.assigned_to && data.assigned_to !== userId) {
      try {
        await notificationService.createNotification({
          user_id: data.assigned_to,
          organization_id: organizationId,
          title: `Nova tarefa atribuída: ${data.title}`,
          message: data.description || `Você recebeu uma nova tarefa para completar.`,
          type: 'task',
          action_url: '/tasks'
        });
      } catch (notificationError) {
        console.error('Error creating task notification:', notificationError);
        // Não falha a criação da tarefa se a notificação falhar
      }
    }

    return data;
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
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;

    // Criar notificação se a tarefa foi reatribuída a alguém diferente
    if (updates.assigned_to && data.assigned_to) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && data.assigned_to !== user.id) {
          await notificationService.createNotification({
            user_id: data.assigned_to,
            organization_id: data.organization_id,
            title: `Tarefa atualizada: ${data.title}`,
            message: `A tarefa "${data.title}" foi atualizada.`,
            type: 'task',
            action_url: '/tasks'
          });
        }
      } catch (notificationError) {
        console.error('Error creating task update notification:', notificationError);
      }
    }

    return data;
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

export async function fetchTasksByUser(userId: string): Promise<Task[]> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('assigned_to', userId)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    throw error;
  }
}