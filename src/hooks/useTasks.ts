import { useState, useEffect } from 'react';
import { Task, TaskCreateRequest, TaskUpdateRequest } from '@/types/task';
import { fetchTasks, createTask, updateTask, deleteTask } from '@/services/taskService';
import { useAuth } from '@/context/AuthContext';
import { useOrganization } from '@/context/OrganizationContext';
import { useToast } from '@/hooks/use-toast';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { organization } = useOrganization();
  const { toast } = useToast();

  const loadTasks = async () => {
    if (!organization?.id) return;
    
    try {
      setLoading(true);
      const tasksData = await fetchTasks(organization.id);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar tarefas',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: TaskCreateRequest) => {
    console.log('useTasks handleCreateTask called with:', taskData);
    console.log('Current organization:', organization?.id, 'Current user:', user?.id);
    
    if (!organization?.id || !user?.id) {
      console.error('Missing organization or user:', { organizationId: organization?.id, userId: user?.id });
      toast({
        title: 'Erro',
        description: 'Organização ou usuário não encontrado',
        variant: 'destructive',
      });
      return;
    }

    try {
      const newTask = await createTask(taskData, organization.id, user.id);
      setTasks(prev => [newTask, ...prev]);
      toast({
        title: 'Sucesso',
        description: 'Tarefa criada com sucesso',
      });
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar tarefa',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleUpdateTask = async (taskId: string, updates: TaskUpdateRequest) => {
    try {
      const updatedTask = await updateTask(taskId, updates);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      toast({
        title: 'Sucesso',
        description: 'Tarefa atualizada com sucesso',
      });
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar tarefa',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast({
        title: 'Sucesso',
        description: 'Tarefa removida com sucesso',
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao remover tarefa',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    loadTasks();
  }, [organization?.id]);

  return {
    tasks,
    loading,
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    refetch: loadTasks,
  };
}