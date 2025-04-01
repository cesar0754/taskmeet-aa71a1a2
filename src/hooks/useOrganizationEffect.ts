
import { useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { loadOrganizationData } from './useLoadOrganizationData';

/**
 * Hook que gerencia o efeito colateral para carregar os dados da organização
 */
export function useOrganizationEffect(
  user: User | null, 
  setOrganization: (org: any) => void,
  setMembers: (members: any[]) => void,
  setLoading: (loading: boolean) => void
) {
  const { toast } = useToast();

  useEffect(() => {
    loadOrganizationData(user, setOrganization, setMembers, setLoading, toast);
  }, [user, toast, setOrganization, setMembers, setLoading]);
}
