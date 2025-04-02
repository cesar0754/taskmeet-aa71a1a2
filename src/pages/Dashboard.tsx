
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsGrid from '@/components/dashboard/StatsGrid';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { initialStats, mockActivities, mockMeetings, mockTasks } from '@/data/dashboardMockData';
import { useAuth } from '@/context/AuthContext';
import { useOrganization } from '@/context/OrganizationContext';
import { fetchOrganizationById } from '@/services/organization/organizationService';
import { supabase } from '@/lib/supabase';
import { DashboardStats, Activity, Meeting, Task } from '@/types/dashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { organization, setCurrentOrganization } = useOrganization();
  
  // Estados para armazenar os dados do dashboard
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Carregar a organização por ID se um parâmetro 'org' estiver na URL
  useEffect(() => {
    const loadSpecificOrganization = async () => {
      if (!user) return;
      
      const params = new URLSearchParams(location.search);
      const orgId = params.get('org');
      
      if (orgId && !organization) {
        console.log('[Dashboard] Tentando carregar organização específica por ID:', orgId);
        try {
          setLoading(true);
          // Verificar se o usuário é membro da organização
          const { data: memberData, error: memberError } = await supabase
            .from('organization_members')
            .select('*')
            .eq('organization_id', orgId)
            .eq('user_id', user.id)
            .single();
            
          if (memberError || !memberData) {
            console.error('[Dashboard] Usuário não é membro da organização:', memberError);
            setLoading(false);
            return;
          }
          
          // Carregar dados da organização
          const org = await fetchOrganizationById(orgId);
          
          if (org) {
            console.log('[Dashboard] Organização carregada com sucesso:', org);
            setCurrentOrganization(org);
            
            // Remover o parâmetro da URL para evitar recarregamentos desnecessários
            // Usamos setTimeout para evitar atualização de estado durante renderização
            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 0);
          }
        } catch (error) {
          console.error('[Dashboard] Erro ao carregar organização:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadSpecificOrganization();
  }, [user, organization, location.search, navigate, setCurrentOrganization]);
  
  // Efeito para carregar dados do dashboard quando a organização estiver disponível
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!organization) return;
      
      // Aqui carregaríamos dados reais do dashboard baseados na organização
      // Por enquanto, mantemos os dados de exemplo
      console.log('[Dashboard] Carregando dados para a organização:', organization.id);
      
      // Poderíamos carregar estatísticas reais aqui
      // const dashboardStats = await fetchDashboardStats(organization.id);
      // setStats(dashboardStats);
    };
    
    loadDashboardData();
  }, [organization]);
  
  // Se não houver usuário, redirecionamos para login
  if (!user) {
    // Usamos useEffect para navegação ao invés de fazer durante a renderização
    useEffect(() => {
      navigate('/login');
    }, [navigate]);
    
    return null;
  }
  
  // Se não houver organização, redirecionamos para criar uma
  if (!organization && !loading) {
    // Verificamos apenas no carregamento inicial, não durante o efeito que carrega a organização específica
    if (!location.search.includes('org=')) {
      // Usamos useEffect para navegação ao invés de fazer durante a renderização
      useEffect(() => {
        navigate('/create-organization');
      }, [navigate]);
      
      return null;
    }
  }
  
  // Se estamos carregando uma organização específica, mostramos um indicador de carregamento
  if (loading || (!organization && location.search.includes('org='))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHeader 
          title="Dashboard" 
          description="Acompanhe o progresso da sua organização e veja as atividades recentes."
        />

        <StatsGrid stats={stats} />

        <DashboardContent 
          activities={activities} 
          meetings={meetings} 
          tasks={tasks} 
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
