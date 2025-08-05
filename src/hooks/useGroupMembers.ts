import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { GroupMember, AddGroupMemberData } from '@/types/group';
import { 
  fetchGroupMembers, 
  addGroupMember, 
  removeGroupMember,
  updateGroupMemberRole 
} from '@/services/groupService';

export function useGroupMembers(groupId?: string) {
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadMembers = async () => {
    if (!groupId) return;
    
    try {
      setLoading(true);
      const data = await fetchGroupMembers(groupId);
      setMembers(data);
    } catch (error) {
      console.error('Erro ao carregar membros do grupo:', error);
      toast({
        title: 'Erro ao carregar membros',
        description: 'Houve um problema ao carregar os membros do grupo.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (memberData: AddGroupMemberData) => {
    try {
      const newMember = await addGroupMember(memberData);
      // Recarregar a lista para pegar os dados completos com join
      await loadMembers();
      
      toast({
        title: 'Membro adicionado',
        description: 'O membro foi adicionado ao grupo com sucesso.',
      });
      
      return newMember;
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
      toast({
        title: 'Erro ao adicionar membro',
        description: 'Houve um problema ao adicionar o membro ao grupo.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleRemoveMember = async (groupMemberId: string) => {
    try {
      await removeGroupMember(groupMemberId);
      setMembers(prev => prev.filter(member => member.id !== groupMemberId));
      
      toast({
        title: 'Membro removido',
        description: 'O membro foi removido do grupo com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao remover membro:', error);
      toast({
        title: 'Erro ao remover membro',
        description: 'Houve um problema ao remover o membro do grupo.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleUpdateMemberRole = async (groupMemberId: string, role: string) => {
    try {
      await updateGroupMemberRole(groupMemberId, role);
      // Recarregar a lista para pegar os dados atualizados
      await loadMembers();
      
      toast({
        title: 'Role atualizada',
        description: 'A role do membro foi atualizada com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao atualizar role:', error);
      toast({
        title: 'Erro ao atualizar role',
        description: 'Houve um problema ao atualizar a role do membro.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    loadMembers();
  }, [groupId]);

  return {
    members,
    loading,
    refreshMembers: loadMembers,
    addMember: handleAddMember,
    removeMember: handleRemoveMember,
    updateMemberRole: handleUpdateMemberRole
  };
}