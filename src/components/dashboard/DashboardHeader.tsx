
import React, { ReactNode } from 'react';

interface DashboardHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, description, action }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default DashboardHeader;
