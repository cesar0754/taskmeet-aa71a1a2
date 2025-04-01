
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Organization {
  id: string;
  name: string;
  created_at: string;
  owner_id: string;
  logo_url?: string;
}

interface Member {
  id: string;
  organization_id: string;
  user_id: string;
  role: string;
  created_at: string;
  email: string;
  name: string;
}

interface OrganizationContextType {
  organization: Organization | null;
  members: Member[];
  loading: boolean;
  createOrganization: (name: string) => Promise<void>;
  updateOrganization: (id: string, data: Partial<Organization>) => Promise<void>;
  addMember: (email: string, name: string, role: string) => Promise<void>;
  updateMember: (id: string, data: Partial<Member>) => Promise<void>;
  removeMember: (id: string) => Promise<void>;
  setCurrentOrganization: (org: Organization) => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrganization = async () => {
      if (!user) {
        setOrganization(null);
        setMembers([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // First check if user is an owner of any organization
        const { data: ownedOrgs, error: ownedOrgsError } = await supabase
          .from('organizations')
          .select('*')
          .eq('owner_id', user.id);

        if (ownedOrgsError) throw ownedOrgsError;

        // Then check if user is a member of any organization
        const { data: memberOrgs, error: memberOrgsError } = await supabase
          .from('organization_members')
          .select('organization_id')
          .eq('user_id', user.id);

        if (memberOrgsError) throw memberOrgsError;

        let selectedOrg = null;

        if (ownedOrgs && ownedOrgs.length > 0) {
          selectedOrg = ownedOrgs[0];
        } else if (memberOrgs && memberOrgs.length > 0) {
          const { data: org, error: orgError } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', memberOrgs[0].organization_id)
            .single();

          if (orgError) throw orgError;
          selectedOrg = org;
        }

        if (selectedOrg) {
          setOrganization(selectedOrg);
          
          // Fetch members
          const { data: orgMembers, error: membersError } = await supabase
            .from('organization_members')
            .select('*')
            .eq('organization_id', selectedOrg.id);

          if (membersError) throw membersError;
          setMembers(orgMembers || []);
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

    fetchOrganization();
  }, [user, toast]);

  const createOrganization = async (name: string) => {
    if (!user) {
      toast({
        title: 'Erro ao criar organização',
        description: 'Você precisa estar logado para criar uma organização.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      // Create the organization
      const { data: newOrg, error: orgError } = await supabase
        .from('organizations')
        .insert([
          { name, owner_id: user.id }
        ])
        .select()
        .single();

      if (orgError) throw orgError;

      // Add the creator as a member with admin role
      const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'Admin';
      
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert([
          { 
            organization_id: newOrg.id, 
            user_id: user.id, 
            role: 'admin',
            name: userName,
            email: user.email
          }
        ]);

      if (memberError) throw memberError;

      setOrganization(newOrg);
      
      // Fetch members to update the state
      const { data: members, error: membersError } = await supabase
        .from('organization_members')
        .select('*')
        .eq('organization_id', newOrg.id);

      if (membersError) throw membersError;
      setMembers(members || []);

      toast({
        title: 'Organização criada',
        description: `A organização "${name}" foi criada com sucesso.`,
      });
    } catch (error) {
      console.error('Error creating organization:', error);
      toast({
        title: 'Erro ao criar organização',
        description: 'Houve um problema ao criar a organização.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrganization = async (id: string, data: Partial<Organization>) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('organizations')
        .update(data)
        .eq('id', id);

      if (error) throw error;

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
      
      // Check if user already exists in the auth system
      const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(email);
      
      // If user doesn't exist, we would need to implement invitation flow
      // For now, let's assume the user is already registered
      const userId = userData?.user?.id || 'pending';

      const { data: newMember, error } = await supabase
        .from('organization_members')
        .insert([
          { 
            organization_id: organization.id, 
            user_id: userId, 
            role,
            name,
            email
          }
        ])
        .select()
        .single();

      if (error) throw error;

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
      
      const { error } = await supabase
        .from('organization_members')
        .update(data)
        .eq('id', id);

      if (error) throw error;

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
      
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .eq('id', id);

      if (error) throw error;

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

  const value = {
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

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>;
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
