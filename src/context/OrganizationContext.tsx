
import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useOrganizationData } from '@/hooks/useOrganizationData';
import { Organization, Member, OrganizationContextType } from '@/types/organization';
import { useOrganizationActions } from '@/hooks/useOrganizationActions';
import { useMemberActions } from '@/hooks/useMemberActions';

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const organizationData = useOrganizationData(user);
  const organizationActions = useOrganizationActions();
  const memberActions = useMemberActions();

  // Combine data and actions to provide complete context
  const contextValue: OrganizationContextType = {
    ...organizationData,
    ...organizationActions,
    ...memberActions
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
