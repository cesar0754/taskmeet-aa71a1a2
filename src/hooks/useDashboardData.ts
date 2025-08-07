
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useOrganization } from '@/context/OrganizationContext';
import { supabase } from '@/lib/supabase';
import { 
  initialStats
} from '@/data/dashboardMockData';
import { fetchDashboardStats } from '@/services/dashboardService';
import { Activity, DashboardStats, Meeting, Task } from '@/types/dashboard';

export { type DashboardStats, type Activity, type Meeting, type Task } from '@/types/dashboard';

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const organizationContext = useOrganization();
  const organization = organizationContext?.organization || null;

  useEffect(() => {
    if (!organization) {
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Busca estatísticas reais
        const dashboardStats = await fetchDashboardStats(organization.id);
        setStats(dashboardStats);

        // Busca próximas reuniões (limitado a 3 mais próximas)
        const now = new Date();
        
        const { data: meetingsData } = await supabase
          .from('meetings')
          .select('*')
          .eq('organization_id', organization.id)
          .gte('start_time', now.toISOString())
          .order('start_time', { ascending: true })
          .limit(3);

        if (meetingsData) {
          const formattedMeetings: Meeting[] = meetingsData.map(meeting => ({
            id: meeting.id,
            title: meeting.title,
            startTime: new Date(meeting.start_time),
            endTime: new Date(meeting.end_time),
            location: meeting.location
          }));
          setMeetings(formattedMeetings);
        }

        // Busca tarefas pendentes
        const { data: tasksData } = await supabase
          .from('tasks')
          .select('id, title, status, due_date, assigned_to')
          .eq('organization_id', organization.id)
          .in('status', ['pending', 'in_progress'])
          .order('due_date', { ascending: true, nullsFirst: false })
          .limit(5);

        if (tasksData) {
          const formattedTasks: Task[] = tasksData.map(task => ({
            id: task.id,
            title: task.title,
            status: task.status as 'pending' | 'in_progress' | 'completed',
            dueDate: task.due_date ? new Date(task.due_date) : undefined,
            assignee: task.assigned_to ? {
              name: 'Usuário Atribuído',
              avatarUrl: undefined
            } : undefined
          }));
          setTasks(formattedTasks);
        }

        // Busca atividades recentes (últimas ações de usuários)
        const recentActivities: Activity[] = [];

        // Adiciona tarefas recentemente criadas como atividades
        const { data: recentTasks } = await supabase
          .from('tasks')
          .select('id, title, created_at, created_by')
          .eq('organization_id', organization.id)
          .order('created_at', { ascending: false })
          .limit(3);

        if (recentTasks) {
          recentTasks.forEach(task => {
            recentActivities.push({
              id: `task-${task.id}`,
              type: 'task',
              content: `Criou a tarefa "${task.title}"`,
              user: {
                name: 'Usuário',
                avatarUrl: undefined
              },
              timestamp: new Date(task.created_at)
            });
          });
        }

        // Adiciona reuniões recentemente criadas como atividades
        const { data: recentMeetingsActivity } = await supabase
          .from('meetings')
          .select('id, title, created_at, created_by')
          .eq('organization_id', organization.id)
          .order('created_at', { ascending: false })
          .limit(3);

        if (recentMeetingsActivity) {
          recentMeetingsActivity.forEach(meeting => {
            recentActivities.push({
              id: `meeting-${meeting.id}`,
              type: 'meeting',
              content: `Agendou a reunião "${meeting.title}"`,
              user: {
                name: 'Usuário',
                avatarUrl: undefined
              },
              timestamp: new Date(meeting.created_at)
            });
          });
        }

        // Adiciona membros recentemente adicionados como atividades
        const { data: recentMembers } = await supabase
          .from('organization_members')
          .select('id, name, created_at')
          .eq('organization_id', organization.id)
          .order('created_at', { ascending: false })
          .limit(3);

        if (recentMembers) {
          recentMembers.forEach(member => {
            recentActivities.push({
              id: `member-${member.id}`,
              type: 'member',
              content: `${member.name} entrou na organização`,
              user: {
                name: member.name,
                avatarUrl: undefined
              },
              timestamp: new Date(member.created_at)
            });
          });
        }

        // Ordena todas as atividades por timestamp e pega apenas as 5 mais recentes
        const sortedActivities = recentActivities
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, 5);

        setActivities(sortedActivities);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [organization]);

  return {
    stats,
    activities,
    meetings,
    tasks,
    loading,
  };
};
