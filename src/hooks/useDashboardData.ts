
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useOrganization } from '@/context/OrganizationContext';
import { 
  initialStats, 
  mockActivities, 
  mockMeetings, 
  mockTasks 
} from '@/data/dashboardMockData';
import { fetchDashboardStats } from '@/services/dashboardService';
import { Activity, DashboardStats, Meeting, Task } from '@/types/dashboard';

export { type DashboardStats, type Activity, type Meeting, type Task } from '@/types/dashboard';

export const useDashboardData = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Inicializa com valores padrão
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  // Obtenha a organização do contexto, com tratamento de erros para caso o contexto não esteja disponível
  let organization = null;
  try {
    const { organization: contextOrganization } = useOrganization();
    organization = contextOrganization;
  } catch (error) {
    console.log('OrganizationContext não disponível:', error);
  }

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
        const dashboardStats = await fetchDashboardStats(organization.id);
        setStats(dashboardStats);

        // Aqui buscaríamos tarefas, reuniões, atividades, etc.
        // Por enquanto vamos manter os dados de exemplo
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    if (organization) {
      fetchData();
    }
  }, [user, organization, navigate]);

  return {
    stats,
    activities,
    meetings,
    tasks,
  };
};
