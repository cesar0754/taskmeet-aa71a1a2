
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import UpcomingMeetings from '@/components/dashboard/UpcomingMeetings';
import PendingTasks from '@/components/dashboard/PendingTasks';
import { useAuth } from '@/context/AuthContext';
import { useOrganization } from '@/context/OrganizationContext';
import { supabase } from '@/lib/supabase';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { organization } = useOrganization();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    tasksCount: 0,
    meetingsCount: 0,
    membersCount: 0,
    groupsCount: 0,
  });

  const [activities, setActivities] = useState([
    {
      id: '1',
      type: 'task' as const,
      content: 'Criou a tarefa "Preparar apresentação"',
      user: {
        name: 'João Silva',
      },
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
    },
    {
      id: '2',
      type: 'meeting' as const,
      content: 'Agendou a reunião "Planejamento semana"',
      user: {
        name: 'Ana Oliveira',
      },
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      id: '3',
      type: 'member' as const,
      content: 'Adicionou Maria Costa à organização',
      user: {
        name: 'Carlos Santos',
      },
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [meetings, setMeetings] = useState([
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

  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Preparar apresentação para cliente',
      status: 'in_progress' as const,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      assignee: {
        name: 'João Silva',
      },
    },
    {
      id: '2',
      title: 'Atualizar documentação',
      status: 'pending' as const,
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      assignee: {
        name: 'Ana Oliveira',
      },
    },
    {
      id: '3',
      title: 'Revisar código do novo recurso',
      status: 'pending' as const,
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

    // Load real data from Supabase here
    const fetchData = async () => {
      try {
        // Fetch tasks count
        const { count: tasksCount, error: tasksError } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('organization_id', organization.id);

        // Fetch meetings count
        const { count: meetingsCount, error: meetingsError } = await supabase
          .from('meetings')
          .select('*', { count: 'exact', head: true })
          .eq('organization_id', organization.id);

        // Fetch members count
        const { count: membersCount, error: membersError } = await supabase
          .from('organization_members')
          .select('*', { count: 'exact', head: true })
          .eq('organization_id', organization.id);

        // Fetch groups count
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

        // Here we would also fetch tasks, meetings, activities, etc.
        // For now we'll use the mock data

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, [user, organization, navigate]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Acompanhe o progresso da sua organização e veja as atividades recentes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Tarefas"
            value={stats.tasksCount}
            icon="tasks"
            delta={{ value: 10, isPositive: true }}
          />
          <StatsCard
            title="Reuniões"
            value={stats.meetingsCount}
            icon="meetings"
            delta={{ value: 5, isPositive: true }}
          />
          <StatsCard
            title="Membros"
            value={stats.membersCount}
            icon="members"
            delta={{ value: 2, isPositive: true }}
          />
          <StatsCard
            title="Grupos"
            value={stats.groupsCount}
            icon="groups"
            delta={{ value: 0, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PendingTasks tasks={tasks} />
          <UpcomingMeetings meetings={meetings} />
        </div>

        <div>
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
