
// Tipos para os dados do dashboard
export interface DashboardStats {
  tasksCount: number;
  meetingsCount: number;
  membersCount: number;
  groupsCount: number;
}

export interface Activity {
  id: string;
  type: 'task' | 'meeting' | 'member';
  content: string;
  user: {
    name: string;
    avatarUrl?: string;
  };
  timestamp: Date;
}

export interface Meeting {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  location?: string;
}

export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: Date;
  assignee?: {
    name: string;
    avatarUrl?: string;
  };
}
