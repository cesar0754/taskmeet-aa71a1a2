
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Member } from '@/types/organization';
import { addNewMember } from '@/services/organization';

export function useAddMember() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addMember = async (organizationId: string, email: string, name: string, role: 'admin' | 'editor' | 'viewer', setMembers: React.Dispatch<React.SetStateAction<Member[]>>) => {
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

  return {
    loading,
    addMember
  };
}
