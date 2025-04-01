
import { User } from '@supabase/supabase-js';
import { useOrganizationEffect } from './useOrganizationEffect';

/**
 * Hook principal que gerencia o carregamento de dados da organização
 */
export function useOrganizationLoader(user: User | null, state: {
  setOrganization: (org: any) => void,
  setMembers: (members: any[]) => void,
  setLoading: (loading: boolean) => void
}) {
  const { setOrganization, setMembers, setLoading } = state;

  // Utilizamos o hook de efeito especializado
  useOrganizationEffect(user, setOrganization, setMembers, setLoading);
}
