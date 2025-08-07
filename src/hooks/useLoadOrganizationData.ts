import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { organizationCache } from '@/lib/cache';
import { 
  fetchUserOrganizations, 
  fetchOrganizationMembers
} from '@/services/organization/organizationService';

// Rastreamento global de requisições em andamento
const loadingRequests = new Set<string>();

/**
 * Hook que gerencia o carregamento de dados da organização e seus membros
 * com cache para evitar requisições repetidas
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

  const cacheKey = `org-${user.id}`;
  
  // Verifica se já existe uma requisição em andamento
  if (loadingRequests.has(cacheKey)) {
    return;
  }

  // Verifica cache primeiro
  const cachedData = organizationCache.get(cacheKey);
  if (cachedData) {
    setOrganization(cachedData.organization);
    setMembers(cachedData.members);
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    loadingRequests.add(cacheKey);
    
    const selectedOrg = await fetchUserOrganizations(user.id);
    
    if (selectedOrg) {
      const orgMembers = await fetchOrganizationMembers(selectedOrg.id);
      
      // Cache os dados
      organizationCache.set(cacheKey, {
        organization: selectedOrg,
        members: orgMembers
      });
      
      setOrganization(selectedOrg);
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
    loadingRequests.delete(cacheKey);
  }
}
