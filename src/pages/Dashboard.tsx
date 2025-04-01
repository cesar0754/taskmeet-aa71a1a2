
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsGrid from '@/components/dashboard/StatsGrid';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useDashboardData } from '@/hooks/useDashboardData';

const Dashboard: React.FC = () => {
  const { stats, activities, meetings, tasks } = useDashboardData();

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
