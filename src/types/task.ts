export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface TaskAssignee {
  id: string;
  task_id: string;
  user_id: string;
  assigned_at: string;
  member?: {
    name: string;
    email: string;
  };
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  assigned_to?: string; // Mantemos para compatibilidade, mas será deprecated
  created_by: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  assigned_member?: {
    name: string;
    email: string;
  };
  assignees?: TaskAssignee[];
}

export interface TaskCreateRequest {
  title: string;
  description?: string;
  priority: TaskPriority;
  due_date?: string;
  assigned_to?: string; // Deprecated - usar assignee_ids
  assignee_ids?: string[];
}

export interface TaskUpdateRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
  assigned_to?: string; // Deprecated - usar assignee_ids
  assignee_ids?: string[];
}