
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { Organization, Member } from '@/types/organization';
import { 
  fetchUserOrganizations, 
  fetchOrganizationMembers,
  createNewOrganization,
  updateExistingOrganization,
  addNewMember,
  updateExistingMember,
  removeExistingMember
} from '@/services/organizationService';

export function useOrganizationState(user: User | null) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadOrganizationData = async () => {
      if (!user) {
        setOrganization(null);
        setMembers([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const selectedOrg = await fetchUserOrganizations(user.id);
        
        if (selectedOrg) {
          setOrganization(selectedOrg);
          const orgMembers = await fetchOrganizationMembers(selectedOrg.id);
          setMembers(orgMembers);
        }
      } catch (error) {
        console.error('Error fetching organization:', error);
        toast({
          title: 'Erro ao carregar organização',
          description: 'Houve um problema ao carregar os dados da organização.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadOrganizationData();
  }, [user, toast]);

  const createOrganization = async (name: string): Promise<Organization | null> => {
    if (!user) {
      toast({
        title: 'Erro ao criar organização',
        description: 'Você precisa estar logado para criar uma organização.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      setLoading(true);
      
      const newOrg = await createNewOrganization(name, user.id);
      if (!newOrg) return null;

      setOrganization(newOrg);
      
      const members = await fetchOrganizationMembers(newOrg.id);
      setMembers(members);

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

  const updateOrganization = async (id: string, data: Partial<Organization>) => {
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

  const setCurrentOrganization = (org: Organization) => {
    setOrganization(org);
  };

  return {
    organization,
    members,
    loading,
    createOrganization,
    updateOrganization,
    addMember,
    updateMember,
    removeMember,
    setCurrentOrganization,
  };
}
