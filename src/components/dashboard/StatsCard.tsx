
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Calendar, Users, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number;
  icon: 'tasks' | 'meetings' | 'members' | 'groups';
  delta?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, delta }) => {
  const navigate = useNavigate();
  
  const icons = {
    tasks: <CheckSquare className="h-5 w-5 text-primary" />,
    meetings: <Calendar className="h-5 w-5 text-secondary" />,
    members: <Users className="h-5 w-5 text-accent" />,
    groups: <Layers className="h-5 w-5 text-warning" />,
  };

  const getNavigationPath = (icon: string) => {
    switch (icon) {
      case 'tasks':
        return '/tasks';
      case 'meetings':
        return '/meetings';
      case 'members':
        return '/members';
      case 'groups':
        return '/groups';
      default:
        return '/dashboard';
    }
  };

  const handleCardClick = () => {
    const path = getNavigationPath(icon);
    navigate(path);
  };

  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105"
      onClick={handleCardClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icons[icon]}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {delta && (
          <p
            className={cn(
              "text-xs mt-1",
              delta.isPositive ? "text-success" : "text-destructive"
            )}
          >
            {delta.isPositive ? "+" : "-"}{delta.value}% desde o último mês
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
