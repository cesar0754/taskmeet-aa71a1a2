
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Member } from '@/types/organization';
import { updateExistingMember } from '@/services/organization';

export function useUpdateMember() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

  return {
    loading,
    updateMember
  };
}
