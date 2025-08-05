import { Notification, NotificationType } from '@/types/notification';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info, 
  Calendar, 
  CheckSquare, 
  UserPlus,
  Trash2,
  ExternalLink 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const getNotificationIcon = (type: NotificationType) => {
  const iconProps = { size: 18 };
  
  switch (type) {
    case 'success':
      return <CheckCircle {...iconProps} className="text-green-600" />;
    case 'warning':
      return <AlertTriangle {...iconProps} className="text-yellow-600" />;
    case 'error':
      return <XCircle {...iconProps} className="text-red-600" />;
    case 'task':
      return <CheckSquare {...iconProps} className="text-blue-600" />;
    case 'meeting':
      return <Calendar {...iconProps} className="text-purple-600" />;
    case 'invitation':
      return <UserPlus {...iconProps} className="text-indigo-600" />;
    default:
      return <Info {...iconProps} className="text-gray-600" />;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800';
    case 'error':
      return 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800';
    case 'task':
      return 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800';
    case 'meeting':
      return 'bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800';
    case 'invitation':
      return 'bg-indigo-50 border-indigo-200 dark:bg-indigo-950 dark:border-indigo-800';
    default:
      return 'bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800';
  }
};

export const NotificationCard = ({ notification, onMarkAsRead, onDelete }: NotificationCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
    locale: ptBR
  });

  const handleMarkAsRead = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  const handleDelete = () => {
    onDelete(notification.id);
  };

  const handleActionClick = () => {
    if (notification.action_url) {
      window.open(notification.action_url, '_blank');
    }
    handleMarkAsRead();
  };

  return (
    <Card className={`transition-all duration-200 ${
      !notification.read 
        ? `${getNotificationColor(notification.type)} shadow-sm` 
        : 'bg-background border-border'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            {getNotificationIcon(notification.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-medium text-foreground">
                    {notification.title}
                  </h4>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
                
                {notification.message && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {notification.message}
                  </p>
                )}
                
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {notification.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {timeAgo}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 ml-2">
                {notification.action_url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleActionClick}
                    className="h-8 w-8 p-0"
                  >
                    <ExternalLink size={14} />
                  </Button>
                )}
                
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAsRead}
                    className="h-8 w-8 p-0"
                  >
                    <Bell size={14} />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};