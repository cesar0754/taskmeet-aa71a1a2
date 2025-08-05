import React, { useState } from 'react';
import { Task } from '@/types/task';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/context/AuthContext';
import { useOrganization } from '@/context/OrganizationContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import TasksList from '@/components/tasks/TasksList';
import TaskForm from '@/components/tasks/TaskForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';

export default function TasksPage() {
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();
  const { user } = useAuth();
  const { organization } = useOrganization();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  console.log('TasksPage render - user:', user?.id, 'organization:', organization?.id);

  const handleCreateTask = async (taskData: any) => {
    setActionLoading(true);
    try {
      await createTask(taskData);
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Error in handleCreateTask:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (taskId: string, status: any) => {
    try {
      await updateTask(taskId, { status });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = async (taskData: any) => {
    if (!editingTask) return;
    
    setActionLoading(true);
    try {
      await updateTask(editingTask.id, taskData);
      setEditingTask(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <DashboardHeader
            title="Tarefas"
            description="Gerencie as tarefas da sua organização"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHeader
          title="Tarefas"
          description="Gerencie as tarefas da sua organização"
          action={
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Tarefa
            </Button>
          }
        />

        <TasksList
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />

        {/* Dialog para criar nova tarefa */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nova Tarefa</DialogTitle>
            </DialogHeader>
            <TaskForm
              onSubmit={handleCreateTask}
              loading={actionLoading}
              onCancel={() => setShowCreateDialog(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog para editar tarefa */}
        {editingTask && (
          <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Editar Tarefa</DialogTitle>
              </DialogHeader>
              <TaskForm
                onSubmit={handleUpdateTask}
                loading={actionLoading}
                onCancel={() => setEditingTask(null)}
                initialData={{
                  title: editingTask.title,
                  description: editingTask.description,
                  priority: editingTask.priority,
                  due_date: editingTask.due_date,
                  assigned_to: editingTask.assigned_to,
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
}