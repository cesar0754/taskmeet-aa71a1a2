
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { Organization, Member } from '@/types/organization';
import { 
  fetchUserOrganizations, 
  fetchOrganizationMembers
} from '@/services/organizationService';

export function useOrganizationData(user: User | null) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
  }, [user, toast]);

  const setCurrentOrganization = (org: Organization) => {
    setOrganization(org);
  };

  return {
    organization,
    members,
    loading,
    setMembers,
    setCurrentOrganization
  };
}
