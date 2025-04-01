
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsGrid from '@/components/dashboard/StatsGrid';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/context/AuthContext';
import { useOrganization } from '@/context/OrganizationContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { organization } = useOrganization();
  const navigate = useNavigate();
  const { stats, activities, meetings, tasks } = useDashboardData();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!organization) {
      navigate('/create-organization');
    }
  }, [user, organization, navigate]);

  if (!user || !organization) {
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
