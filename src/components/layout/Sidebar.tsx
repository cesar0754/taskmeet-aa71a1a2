
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
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
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, active }) => {
  return (
    <Link to={to} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 px-2 font-normal",
          active ? "bg-primary/10 text-primary" : "hover:bg-primary/5"
        )}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const { signOut } = useAuth();
  const { organization } = useOrganization();
  const location = useLocation();
  
  const handleSignOut = async () => {
    await signOut();
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
    <aside className="w-64 hidden md:flex flex-col h-screen bg-background border-r p-4">
      <div className="flex items-center gap-2 mb-6 py-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
          {organization?.name.charAt(0) || 'O'}
        </div>
        <div className="flex flex-col">
          <h3 className="font-medium text-sm truncate max-w-[180px]">{organization?.name || 'Organização'}</h3>
          <span className="text-xs text-muted-foreground truncate max-w-[180px]">Workspace</span>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1">
        {links.map((link) => (
          <SidebarLink
            key={link.to}
            to={link.to}
            icon={link.icon}
            label={link.label}
            active={location.pathname === link.to}
          />
        ))}
      </nav>
      
      <Separator className="my-4" />
      
      <Button variant="ghost" className="justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10" onClick={handleSignOut}>
        <LogOut size={20} />
        <span>Sair</span>
      </Button>
    </aside>
  );
};

export default Sidebar;
