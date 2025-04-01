
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useOrganization } from '@/context/OrganizationContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';

const Header: React.FC = () => {
  const { user } = useAuth();
  const { organization } = useOrganization();
  
  // Placeholder for notification count
  const notificationCount = 3;

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
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {notificationCount}
              </Badge>
            )}
          </Button>

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
