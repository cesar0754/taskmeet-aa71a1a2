
import React from 'react';
import StatsCard from '@/components/dashboard/StatsCard';
import { DashboardStats } from '@/hooks/useDashboardData';

interface StatsGridProps {
  stats: DashboardStats;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
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
  );
};

export default StatsGrid;
