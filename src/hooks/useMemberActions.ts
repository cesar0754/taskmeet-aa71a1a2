
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Organization, Member } from '@/types/organization';
import { 
  addNewMember,
  updateExistingMember,
  removeExistingMember
} from '@/services/organizationService';

export function useMemberActions(
  organization: Organization | null,
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>
) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addMember = async (email: string, name: string, role: string) => {
    if (!organization) {
      toast({
        title: 'Erro ao adicionar membro',
        description: 'Nenhuma organização selecionada.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      const newMember = await addNewMember(organization.id, email, name, role);
      
      setMembers(prev => [...prev, newMember]);

      toast({
        title: 'Membro adicionado',
        description: `${name} foi adicionado à organização.`,
      });
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        title: 'Erro ao adicionar membro',
        description: 'Houve um problema ao adicionar o membro à organização.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMember = async (id: string, data: Partial<Member>) => {
    try {
      setLoading(true);
      
      await updateExistingMember(id, data);
      
      setMembers(prev => prev.map(member => 
        member.id === id ? { ...member, ...data } : member
      ));

      toast({
        title: 'Membro atualizado',
        description: 'As informações do membro foram atualizadas com sucesso.',
      });
    } catch (error) {
      console.error('Error updating member:', error);
      toast({
        title: 'Erro ao atualizar membro',
        description: 'Houve um problema ao atualizar as informações do membro.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (id: string) => {
    try {
      setLoading(true);
      
      await removeExistingMember(id);
      
      setMembers(prev => prev.filter(member => member.id !== id));

      toast({
        title: 'Membro removido',
        description: 'O membro foi removido da organização.',
      });
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: 'Erro ao remover membro',
        description: 'Houve um problema ao remover o membro da organização.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    addMember,
    updateMember,
    removeMember
  };
}
