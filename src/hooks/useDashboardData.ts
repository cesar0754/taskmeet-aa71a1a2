
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useOrganization } from '@/context/OrganizationContext';
import { supabase } from '@/lib/supabase';

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

export const useDashboardData = () => {
  const { user } = useAuth();
  const { organization } = useOrganization();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats>({
    tasksCount: 0,
    meetingsCount: 0,
    membersCount: 0,
    groupsCount: 0,
  });

  // Dados de exemplo para atividades
  const [activities, setActivities] = useState<Activity[]>([
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
  ]);

  // Dados de exemplo para reuniões
  const [meetings, setMeetings] = useState<Meeting[]>([
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
  ]);

  // Dados de exemplo para tarefas
  const [tasks, setTasks] = useState<Task[]>([
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
  ]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!organization) {
      navigate('/create-organization');
      return;
    }

    // Carrega dados reais do Supabase
    const fetchData = async () => {
      try {
        // Busca contagem de tarefas
        const { count: tasksCount, error: tasksError } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('organization_id', organization.id);

        // Busca contagem de reuniões
        const { count: meetingsCount, error: meetingsError } = await supabase
          .from('meetings')
          .select('*', { count: 'exact', head: true })
          .eq('organization_id', organization.id);

        // Busca contagem de membros
        const { count: membersCount, error: membersError } = await supabase
          .from('organization_members')
          .select('*', { count: 'exact', head: true })
          .eq('organization_id', organization.id);

        // Busca contagem de grupos
        const { count: groupsCount, error: groupsError } = await supabase
          .from('work_groups')
          .select('*', { count: 'exact', head: true })
          .eq('organization_id', organization.id);

        setStats({
          tasksCount: tasksCount || 0,
          meetingsCount: meetingsCount || 0,
          membersCount: membersCount || 0,
          groupsCount: groupsCount || 0,
        });

        // Aqui buscaríamos tarefas, reuniões, atividades, etc.
        // Por enquanto vamos manter os dados de exemplo

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, [user, organization, navigate]);

  return {
    stats,
    activities,
    meetings,
    tasks,
  };
};
