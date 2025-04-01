
import { User } from '@supabase/supabase-js';
import { useOrganizationState } from './useOrganizationState';
import { useOrganizationLoader } from './useOrganizationLoader';

export function useOrganizationData(user: User | null) {
  const state = useOrganizationState();
  
  useOrganizationLoader(user, {
    setOrganization: state.setOrganization,
    setMembers: state.setMembers,
    setLoading: state.setLoading
  });

  return {
    organization: state.organization,
    members: state.members,
    loading: state.loading,
    setOrganization: state.setOrganization,
    setMembers: state.setMembers,
    setCurrentOrganization: state.setCurrentOrganization
  };
}
