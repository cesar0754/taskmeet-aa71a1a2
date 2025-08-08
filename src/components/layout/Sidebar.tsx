
import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Users, 
  UserCircle,
  Bell,
  Settings,
  LogOut,
  Layers
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useOrganization } from '@/context/OrganizationContext';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarSeparator
} from '@/components/ui/sidebar';

const AppSidebar: React.FC = () => {
  const { signOut } = useAuth();
  const { organization } = useOrganization();
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      // O hook useSignOut já faz o redirecionamento para "/" automaticamente
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const links = [
    { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/tasks", icon: <CheckSquare size={20} />, label: "Tarefas" },
    { to: "/meetings", icon: <Calendar size={20} />, label: "Reuniões" },
    { to: "/members", icon: <Users size={20} />, label: "Membros" },
    { to: "/groups", icon: <Layers size={20} />, label: "Grupos" },
    { to: "/notifications", icon: <Bell size={20} />, label: "Notificações" },
    { to: "/profile", icon: <UserCircle size={20} />, label: "Perfil" },
    { to: "/settings", icon: <Settings size={20} />, label: "Configurações" },
  ];

  return (
    <Sidebar className="hidden md:flex">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            {organization?.name.charAt(0) || 'O'}
          </div>
          <div className="flex flex-col">
            <h3 className="font-medium text-sm truncate max-w-[180px]">{organization?.name || 'Organização'}</h3>
            <span className="text-xs text-muted-foreground truncate max-w-[180px]">Workspace</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => (
                <SidebarMenuItem key={link.to}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === link.to}
                    tooltip={link.label}
                  >
                    <Link to={link.to}>
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarSeparator />
        <div className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="Sair"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                onClick={handleSignOut}
              >
                <LogOut size={20} />
                <span>Sair</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
