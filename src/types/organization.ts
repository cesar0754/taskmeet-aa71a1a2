
export interface Organization {
  id: string;
  name: string;
  created_at: string;
  owner_id: string;
  logo_url?: string;
}

export interface Member {
  id: string;
  organization_id: string;
  user_id: string;
  role: string;
  created_at: string;
  email: string;
  name: string;
}

export interface OrganizationContextType {
  organization: Organization | null;
  members: Member[];
  loading: boolean;
  createOrganization: (name: string) => Promise<Organization | null>;
  updateOrganization: (id: string, data: Partial<Organization>) => Promise<void>;
  addMember: (email: string, name: string, role: string) => Promise<Member | null>;
  updateMember: (id: string, data: Partial<Member>) => Promise<boolean>;
  removeMember: (id: string) => Promise<boolean>;
  setCurrentOrganization: (org: Organization) => void;
}
