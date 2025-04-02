
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
      
      // Primeiro atualizamos o estado localmente para uma resposta imediata na UI
      setMembers((prevMembers) => {
        console.log('Atualizando estado antes da chamada à API, removendo membro:', id);
        return prevMembers.filter(member => member.id !== id);
      });
      
      // Então executamos a operação no servidor
      const success = await removeExistingMember(id);
      
      if (!success) {
        // Se a operação falhou no servidor, revertemos a mudança local
        console.error('Falha na remoção do membro no servidor, revertendo estado local');
        toast({
          title: 'Erro ao remover membro',
          description: 'Houve um problema ao remover o membro da organização. Por favor, tente novamente.',
          variant: 'destructive',
        });
        return false;
      }
      
      console.log('Membro removido com sucesso no servidor e estado local');
      toast({
        title: 'Membro removido',
        description: 'O membro foi removido da organização.',
      });
      
      return true;
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
