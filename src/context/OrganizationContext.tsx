
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useOrganizationData } from '@/hooks/useOrganizationData';
import { Organization, Member, OrganizationContextType } from '@/types/organization';
import { useOrganizationActions } from '@/hooks/useOrganizationActions';
import { useMemberActions } from '@/hooks/useMemberActions';

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { organization, members, loading, setMembers, setOrganization, setCurrentOrganization } = useOrganizationData(user);
  const { createOrganization: createOrg, updateOrganization: updateOrg, loading: orgActionsLoading } = useOrganizationActions();
  const { addMember: addMemberAction, updateMember: updateMemberAction, removeMember: removeMemberAction, loading: memberActionsLoading } = useMemberActions();

  // Adapters para garantir a compatibilidade com a API anterior
  const createOrganization = useCallback(async (name: string): Promise<Organization | null> => {
    if (!user) return null;
    const newOrg = await createOrg(name, user.id);
    if (newOrg) {
      setOrganization(newOrg);
    }
    return newOrg;
  }, [user, createOrg, setOrganization]);

  const updateOrganization = useCallback(async (id: string, data: Partial<Organization>) => {
    return updateOrg(id, data, setOrganization);
  }, [updateOrg, setOrganization]);

  const addMember = useCallback(async (email: string, name: string, role: string): Promise<Member | null> => {
    if (!organization) return null;
    return addMemberAction(organization.id, email, name, role, setMembers);
  }, [organization, addMemberAction, setMembers]);

  const updateMember = useCallback(async (id: string, data: Partial<Member>): Promise<boolean> => {
    return updateMemberAction(id, data, setMembers);
  }, [updateMemberAction, setMembers]);

  const removeMember = useCallback(async (id: string): Promise<boolean> => {
    return removeMemberAction(id, setMembers);
  }, [removeMemberAction, setMembers]);

  // Combine data and actions to provide complete context
  const contextValue: OrganizationContextType = {
    organization,
    members,
    loading: loading || orgActionsLoading || memberActionsLoading,
    createOrganization,
    updateOrganization,
    addMember,
    updateMember,
    removeMember,
    setCurrentOrganization
  };

  return (
    <OrganizationContext.Provider value={contextValue}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
