
import React from 'react';
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
  const icons = {
    tasks: <CheckSquare className="h-5 w-5 text-primary" />,
    meetings: <Calendar className="h-5 w-5 text-secondary" />,
    members: <Users className="h-5 w-5 text-accent" />,
    groups: <Layers className="h-5 w-5 text-warning" />,
  };

  return (
    <Card>
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
