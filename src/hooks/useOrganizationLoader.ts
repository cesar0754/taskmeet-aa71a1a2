
import { useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchUserOrganizations, 
  fetchOrganizationMembers
} from '@/services/organizationService';

export function useOrganizationLoader(user: User | null, state: {
  setOrganization: (org: any) => void,
  setMembers: (members: any[]) => void,
  setLoading: (loading: boolean) => void
}) {
  const { toast } = useToast();
  const { setOrganization, setMembers, setLoading } = state;

  useEffect(() => {
    const loadOrganizationData = async () => {
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
    };

    loadOrganizationData();
  }, [user, toast, setOrganization, setMembers, setLoading]);
}
