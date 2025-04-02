
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsGrid from '@/components/dashboard/StatsGrid';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/context/AuthContext';
import { useOrganization } from '@/context/OrganizationContext';
import { initialStats, mockActivities, mockMeetings, mockTasks } from '@/data/dashboardMockData';
import { fetchOrganizationById } from '@/services/organization/organizationService';
import { supabase } from '@/lib/supabase';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { organization, setCurrentOrganization } = useOrganization();
  
  // Coletar dados do dashboard
  let stats = initialStats;
  let activities = [];
  let meetings = [];
  let tasks = [];
  
  // Se tivermos a organização, usamos seus dados no dashboard
  if (organization) {
    const dashboardData = useDashboardData();
    stats = dashboardData.stats;
    activities = dashboardData.activities;
    meetings = dashboardData.meetings;
    tasks = dashboardData.tasks;
  }

  // Carregar a organização por ID se um parâmetro 'org' estiver na URL
  useEffect(() => {
    const loadSpecificOrganization = async () => {
      if (!user) return;
      
      const params = new URLSearchParams(location.search);
      const orgId = params.get('org');
      
      if (orgId) {
        console.log('[Dashboard] Tentando carregar organização específica por ID:', orgId);
        try {
          // Verificar se o usuário é membro da organização
          const { data: memberData, error: memberError } = await supabase
            .from('organization_members')
            .select('*')
            .eq('organization_id', orgId)
            .eq('user_id', user.id)
            .single();
            
          if (memberError || !memberData) {
            console.error('[Dashboard] Usuário não é membro da organização:', memberError);
            return;
          }
          
          // Carregar dados da organização
          const org = await fetchOrganizationById(orgId);
          
          if (org) {
            console.log('[Dashboard] Organização carregada com sucesso:', org);
            setCurrentOrganization(org);
            
            // Remover o parâmetro da URL para evitar recarregamentos desnecessários
            navigate('/dashboard', { replace: true });
          }
        } catch (error) {
          console.error('[Dashboard] Erro ao carregar organização:', error);
        }
      }
    };
    
    loadSpecificOrganization();
  }, [user, location.search, navigate, setCurrentOrganization]);
  
  // Se não houver usuário, redirecionamos para login
  if (!user) {
    navigate('/login');
    return null;
  }
  
  // Se não houver organização, redirecionamos para criar uma
  if (!organization) {
    // Verificamos apenas no carregamento inicial, não durante o efeito que carrega a organização específica
    if (!location.search.includes('org=')) {
      navigate('/create-organization');
      return null;
    }
    
    // Se estamos tentando carregar uma organização específica, mostramos um indicador de carregamento
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
