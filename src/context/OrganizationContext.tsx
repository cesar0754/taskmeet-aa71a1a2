
import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useOrganizationState } from '@/hooks/useOrganizationState';
import { OrganizationContextType } from '@/types/organization';

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const organizationState = useOrganizationState(user);

  return (
    <OrganizationContext.Provider value={organizationState}>
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
