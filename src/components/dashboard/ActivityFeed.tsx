
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckSquare, Calendar, Users, MessageSquare } from 'lucide-react';

type ActivityType = 'task' | 'meeting' | 'member' | 'comment';

interface Activity {
  id: string;
  type: ActivityType;
  content: string;
  user: {
    name: string;
    avatarUrl?: string;
  };
  timestamp: Date;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityIcon: React.FC<{ type: ActivityType }> = ({ type }) => {
  switch (type) {
    case 'task':
      return <CheckSquare className="h-4 w-4 text-primary" />;
    case 'meeting':
      return <Calendar className="h-4 w-4 text-secondary" />;
    case 'member':
      return <Users className="h-4 w-4 text-accent" />;
    case 'comment':
      return <MessageSquare className="h-4 w-4 text-muted-foreground" />;
  }
};

const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMins < 60) {
    return `${diffInMins} min atrás`;
  } else if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'} atrás`;
  } else if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'dia' : 'dias'} atrás`;
  } else {
    return date.toLocaleDateString('pt-BR');
  }
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const navigate = useNavigate();

  const getNavigationPath = (type: ActivityType) => {
    switch (type) {
      case 'task':
        return '/tasks';
      case 'meeting':
        return '/meetings';
      case 'member':
        return '/members';
      case 'comment':
        return '/notifications';
      default:
        return '/dashboard';
    }
  };

  const handleActivityClick = (activity: Activity) => {
    const path = getNavigationPath(activity.type);
    navigate(path);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            Nenhuma atividade recente
          </div>
        ) : (
          activities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
              onClick={() => handleActivityClick(activity)}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatarUrl} />
                <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center">
                  <span className="font-medium text-sm">{activity.user.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {formatRelativeTime(activity.timestamp)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <ActivityIcon type={activity.type} />
                  <span>{activity.content}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
