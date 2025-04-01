
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsGrid from '@/components/dashboard/StatsGrid';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/context/AuthContext';
import { useOrganization } from '@/context/OrganizationContext';
import { initialStats, mockActivities, mockMeetings, mockTasks } from '@/data/dashboardMockData';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  let organizationData = null;
  let stats = initialStats;
  let activities = [];
  let meetings = [];
  let tasks = [];
  
  try {
    const { organization } = useOrganization();
    organizationData = organization;
    
    // Só carregamos os dados do dashboard se o contexto de organização estiver disponível
    if (organization) {
      const dashboardData = useDashboardData();
      stats = dashboardData.stats;
      activities = dashboardData.activities;
      meetings = dashboardData.meetings;
      tasks = dashboardData.tasks;
    }
  } catch (error) {
    console.error("Erro ao acessar contexto de organização:", error);
    // Se ocorrer algum erro ao tentar acessar o contexto, redirecionamos para a página de login
    if (user) {
      navigate('/create-organization');
    } else {
      navigate('/login');
    }
    return null;
  }

  if (!user || !organizationData) {
    return null; // Não renderiza nada até redirecionar
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHeader 
          title="Dashboard" 
          description="Acompanhe o progresso da sua organização e veja as atividades recentes."
        />

        <StatsGrid stats={stats} />

        <DashboardContent 
          activities={activities} 
          meetings={meetings} 
          tasks={tasks} 
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
