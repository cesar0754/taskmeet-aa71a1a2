
import { User } from '@supabase/supabase-js';
import { Organization, Member } from '@/types/organization';
import { useOrganizationData } from './useOrganizationData';
import { useOrganizationActions } from './useOrganizationActions';
import { useMemberActions } from './useMemberActions';

export function useOrganizationState(user: User | null) {
  const { 
    organization, 
    members, 
    loading: dataLoading,
    setMembers,
    setCurrentOrganization
  } = useOrganizationData(user);

  const { 
    loading: orgActionsLoading, 
    createOrganization, 
    updateOrganization 
  } = useOrganizationActions(user, setMembers, setCurrentOrganization);

  const { 
    loading: memberActionsLoading, 
    addMember, 
    updateMember, 
    removeMember 
  } = useMemberActions(organization, setMembers);

  // Combinamos os estados de carregamento dos três hooks
  const loading = dataLoading || orgActionsLoading || memberActionsLoading;

  return {
    organization,
    members,
    loading,
    createOrganization,
    updateOrganization,
    addMember,
    updateMember,
    removeMember,
    setCurrentOrganization,
  };
}
