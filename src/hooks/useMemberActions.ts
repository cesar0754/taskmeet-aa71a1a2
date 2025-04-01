
import { useState } from 'react';
import { useAddMember } from './useAddMember';
import { useUpdateMember } from './useUpdateMember';
import { useRemoveMember } from './useRemoveMember';
import { Member } from '@/types/organization';

export function useMemberActions() {
  const { loading: addLoading, addMember } = useAddMember();
  const { loading: updateLoading, updateMember } = useUpdateMember();
  const { loading: removeLoading, removeMember } = useRemoveMember();
  
  const loading = addLoading || updateLoading || removeLoading;

  return {
    loading,
    addMember,
    updateMember,
    removeMember
  };
}
