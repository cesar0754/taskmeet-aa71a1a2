
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useOrganization } from '@/context/OrganizationContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useNotifications } from '@/hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Header: React.FC = () => {
  const { user } = useAuth();
  const { organization } = useOrganization();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const recentNotifications = notifications.slice(0, 5);

  return (
    <header className="sticky top-0 z-40 border-b bg-background flex items-center h-16 px-4">
      <div className="flex items-center gap-2 md:hidden">
        <SidebarTrigger />
      </div>

      <div className="flex-1 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold md:text-xl">
            {organization?.name || 'TaskMeet'}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Notificações</span>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs"
                    >
                      Marcar todas como lidas
                    </Button>
                  )}
                </div>
                
                {recentNotifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    Nenhuma notificação
                  </p>
                ) : (
                  <>
                    <div className="space-y-2">
                      {recentNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-2 rounded-md border cursor-pointer hover:bg-muted/50 ${
                            !notification.read ? 'bg-muted/30' : ''
                          }`}
                          onClick={() => {
                            if (!notification.read) {
                              markAsRead(notification.id);
                            }
                            if (notification.action_url) {
                              navigate(notification.action_url);
                            }
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className={`text-sm font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full mt-1 ml-2 flex-shrink-0" />
                            )}
                          </div>
                          {notification.message && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(notification.created_at), {
                              addSuffix: true,
                              locale: ptBR
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    {notifications.length > 5 && (
                      <>
                        <Separator className="my-2" />
                        <DropdownMenuItem onClick={() => navigate('/notifications')}>
                          Ver todas as notificações
                        </DropdownMenuItem>
                      </>
                    )}
                  </>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={user?.user_metadata?.avatar_url} 
                alt={user?.user_metadata?.name || 'User'} 
              />
              <AvatarFallback>
                {user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-medium">{user?.user_metadata?.name || user?.email?.split('@')[0]}</span>
              <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
