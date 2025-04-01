
import { Activity, DashboardStats, Meeting, Task } from "@/types/dashboard";

// Dados estatísticos iniciais
export const initialStats: DashboardStats = {
  tasksCount: 0,
  meetingsCount: 0,
  membersCount: 0,
  groupsCount: 0,
};

// Dados de exemplo para atividades
export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'task',
    content: 'Criou a tarefa "Preparar apresentação"',
    user: {
      name: 'João Silva',
    },
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
  },
  {
    id: '2',
    type: 'meeting',
    content: 'Agendou a reunião "Planejamento semana"',
    user: {
      name: 'Ana Oliveira',
    },
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: '3',
    type: 'member',
    content: 'Adicionou Maria Costa à organização',
    user: {
      name: 'Carlos Santos',
    },
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

// Dados de exemplo para reuniões
export const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Planejamento da semana',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
    location: 'Sala de reuniões',
  },
  {
    id: '2',
    title: 'Revisão de projeto',
    startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
    location: 'Online (Google Meet)',
  },
];

// Dados de exemplo para tarefas
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Preparar apresentação para cliente',
    status: 'in_progress',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    assignee: {
      name: 'João Silva',
    },
  },
  {
    id: '2',
    title: 'Atualizar documentação',
    status: 'pending',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    assignee: {
      name: 'Ana Oliveira',
    },
  },
  {
    id: '3',
    title: 'Revisar código do novo recurso',
    status: 'pending',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    assignee: {
      name: 'Carlos Santos',
    },
  },
];
