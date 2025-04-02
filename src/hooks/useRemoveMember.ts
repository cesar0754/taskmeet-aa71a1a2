
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Member } from '@/types/organization';
import { removeExistingMember } from '@/services/organization';

export function useRemoveMember() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const removeMember = async (id: string, setMembers: React.Dispatch<React.SetStateAction<Member[]>>) => {
    try {
      setLoading(true);
      console.log('Iniciando remoção do membro com ID:', id);
      
      const success = await removeExistingMember(id);
      
      if (success) {
        console.log('Membro removido no servidor, atualizando estado local');
        
        // Usando uma função callback para garantir que o estado seja atualizado corretamente
        setMembers((prevMembers) => {
          const updatedMembers = prevMembers.filter(member => member.id !== id);
          console.log('Membros após remoção:', updatedMembers.length);
          return updatedMembers;
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
    removeMember
  };
}
