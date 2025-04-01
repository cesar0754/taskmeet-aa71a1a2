import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Member } from '@/types/organization';
import { 
  addNewMember,
  updateExistingMember,
  removeExistingMember
} from '@/services/organizationService';

export function useMemberActions() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addMember = async (organizationId: string, email: string, name: string, role: string, setMembers: React.Dispatch<React.SetStateAction<Member[]>>) => {
    if (!organizationId) {
      toast({
        title: 'Erro ao adicionar membro',
        description: 'Nenhuma organização selecionada.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      setLoading(true);
      console.log('Adicionando novo membro:', { email, name, role });
      
      const newMember = await addNewMember(organizationId, email, name, role);
      
      if (newMember) {
        console.log('Membro adicionado com sucesso:', newMember);
        setMembers(prev => [...prev, newMember]);

        toast({
          title: 'Membro adicionado',
          description: `${name} foi adicionado à organização.`,
        });
        
        return newMember;
      }
      return null;
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
      toast({
        title: 'Erro ao adicionar membro',
        description: 'Houve um problema ao adicionar o membro à organização.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateMember = async (id: string, data: Partial<Member>, setMembers: React.Dispatch<React.SetStateAction<Member[]>>) => {
    try {
      setLoading(true);
      console.log('Atualizando membro:', { id, data });
      
      await updateExistingMember(id, data);
      
      setMembers(prev => prev.map(member => 
        member.id === id ? { ...member, ...data } : member
      ));

      toast({
        title: 'Membro atualizado',
        description: 'As informações do membro foram atualizadas com sucesso.',
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar membro:', error);
      toast({
        title: 'Erro ao atualizar membro',
        description: 'Houve um problema ao atualizar as informações do membro.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (id: string, setMembers: React.Dispatch<React.SetStateAction<Member[]>>) => {
    try {
      setLoading(true);
      console.log('Iniciando remoção do membro com ID:', id);
      
      const success = await removeExistingMember(id);
      
      if (success) {
        console.log('Membro removido no servidor, atualizando estado local');
        
        setMembers(prev => {
          const filtered = prev.filter(member => member.id !== id);
          console.log('Membros após remoção:', filtered.length);
          return filtered;
        });

        toast({
          title: 'Membro removido',
          description: 'O membro foi removido da organização.',
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao remover membro:', error);
      toast({
        title: 'Erro ao remover membro',
        description: 'Houve um problema ao remover o membro da organização.',
        variant: 'destructive',
      });
      return false;
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
