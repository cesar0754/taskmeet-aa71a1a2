import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchUserOrganizations, 
  fetchOrganizationMembers
} from '@/services/organization';

/**
 * Hook que gerencia o carregamento de dados da organização e seus membros
 */
export async function loadOrganizationData(
  user: User | null, 
  setOrganization: (org: any) => void,
  setMembers: (members: any[]) => void,
  setLoading: (loading: boolean) => void,
  toast: ReturnType<typeof useToast>['toast']
) {
  if (!user) {
    setOrganization(null);
    setMembers([]);
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    
    const selectedOrg = await fetchUserOrganizations(user.id);
    
    if (selectedOrg) {
      setOrganization(selectedOrg);
      const orgMembers = await fetchOrganizationMembers(selectedOrg.id);
      setMembers(orgMembers);
    }
  } catch (error) {
    console.error('Error fetching organization:', error);
    toast({
      title: 'Erro ao carregar organização',
      description: 'Houve um problema ao carregar os dados da organização.',
      variant: 'destructive',
    });
  } finally {
    setLoading(false);
  }
}
