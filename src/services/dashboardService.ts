
import { supabase } from '@/lib/supabase';
import { DashboardStats } from '@/types/dashboard';

export async function fetchDashboardStats(organizationId: string): Promise<DashboardStats> {
  try {
    // Busca contagem de tarefas
    const { count: tasksCount, error: tasksError } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId);

    // Busca contagem de reuniões
    const { count: meetingsCount, error: meetingsError } = await supabase
      .from('meetings')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId);

    // Busca contagem de membros
    const { count: membersCount, error: membersError } = await supabase
      .from('organization_members')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId);

    // Busca contagem de grupos
    const { count: groupsCount, error: groupsError } = await supabase
      .from('work_groups')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId);

    return {
      tasksCount: tasksCount || 0,
      meetingsCount: meetingsCount || 0,
      membersCount: membersCount || 0,
      groupsCount: groupsCount || 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}
