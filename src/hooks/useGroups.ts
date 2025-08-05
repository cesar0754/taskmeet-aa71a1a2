import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Group, CreateGroupData, UpdateGroupData } from '@/types/group';
import { 
  fetchGroups, 
  createGroup, 
  updateGroup, 
  deleteGroup 
} from '@/services/groupService';

export function useGroups(organizationId?: string) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadGroups = async () => {
    if (!organizationId) return;
    
    try {
      setLoading(true);
      const data = await fetchGroups(organizationId);
      setGroups(data);
    } catch (error) {
      console.error('Erro ao carregar grupos:', error);
      toast({
        title: 'Erro ao carregar grupos',
        description: 'Houve um problema ao carregar a lista de grupos.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (groupData: CreateGroupData) => {
    try {
      const newGroup = await createGroup(groupData);
      setGroups(prev => [newGroup, ...prev]);
      
      toast({
        title: 'Grupo criado',
        description: 'O grupo foi criado com sucesso.',
      });
      
      return newGroup;
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      toast({
        title: 'Erro ao criar grupo',
        description: 'Houve um problema ao criar o grupo.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleUpdateGroup = async (groupId: string, groupData: UpdateGroupData) => {
    try {
      const updatedGroup = await updateGroup(groupId, groupData);
      setGroups(prev => prev.map(group => 
        group.id === groupId ? updatedGroup : group
      ));
      
      toast({
        title: 'Grupo atualizado',
        description: 'O grupo foi atualizado com sucesso.',
      });
      
      return updatedGroup;
    } catch (error) {
      console.error('Erro ao atualizar grupo:', error);
      toast({
        title: 'Erro ao atualizar grupo',
        description: 'Houve um problema ao atualizar o grupo.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await deleteGroup(groupId);
      setGroups(prev => prev.filter(group => group.id !== groupId));
      
      toast({
        title: 'Grupo removido',
        description: 'O grupo foi removido com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao deletar grupo:', error);
      toast({
        title: 'Erro ao remover grupo',
        description: 'Houve um problema ao remover o grupo.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    loadGroups();
  }, [organizationId]);

  return {
    groups,
    loading,
    refreshGroups: loadGroups,
    createGroup: handleCreateGroup,
    updateGroup: handleUpdateGroup,
    deleteGroup: handleDeleteGroup
  };
}