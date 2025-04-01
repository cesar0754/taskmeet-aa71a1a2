
import { useState } from 'react';
import { Organization, Member } from '@/types/organization';

export function useOrganizationState() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const setCurrentOrganization = (org: Organization) => {
    setOrganization(org);
  };

  return {
    organization,
    members,
    loading,
    setOrganization,
    setMembers,
    setLoading,
    setCurrentOrganization
  };
}
