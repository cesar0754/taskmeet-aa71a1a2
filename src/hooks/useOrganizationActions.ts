
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Organization, Member } from '@/types/organization';
import { 
  createNewOrganization,
  updateExistingOrganization,
  fetchOrganizationMembers
} from '@/services/organizationService';

export function useOrganizationActions() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createOrganization = async (name: string, userId: string): Promise<Organization | null> => {
    if (!userId) {
      toast({
        title: 'Erro ao criar organização',
        description: 'Você precisa estar logado para criar uma organização.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      setLoading(true);
      
      const newOrg = await createNewOrganization(name, userId);
      if (!newOrg) return null;
      
      const members = await fetchOrganizationMembers(newOrg.id);

      toast({
        title: 'Organização criada',
        description: `A organização "${name}" foi criada com sucesso.`,
      });

      return newOrg;
    } catch (error) {
      console.error('Error creating organization:', error);
      toast({
        title: 'Erro ao criar organização',
        description: 'Houve um problema ao criar a organização.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateOrganization = async (id: string, data: Partial<Organization>, setOrganization: React.Dispatch<React.SetStateAction<Organization | null>>) => {
    try {
      setLoading(true);
      
      await updateExistingOrganization(id, data);
      
      setOrganization(prev => prev && { ...prev, ...data });

      toast({
        title: 'Organização atualizada',
        description: 'As informações da organização foram atualizadas com sucesso.',
      });
    } catch (error) {
      console.error('Error updating organization:', error);
      toast({
        title: 'Erro ao atualizar organização',
        description: 'Houve um problema ao atualizar as informações da organização.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createOrganization,
    updateOrganization
  };
}
