import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import OrganizationCard from '@/components/organizations/OrganizationCard';
import { useAuth } from '@/context/AuthContext';
import { fetchAllUserOrganizations, fetchOrganizationMembers } from '@/services/organization/organizationService';
import { Organization } from '@/types/organization';

const SelectOrganizationPage: React.FC = () => {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [membersCount, setMembersCount] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Selecionar organização | App';
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      const orgs = await fetchAllUserOrganizations(user.id);
      setOrganizations(orgs);

      // Carregar contagem de membros de forma simples
      const counts: Record<string, number> = {};
      for (const org of orgs) {
        try {
          const members = await fetchOrganizationMembers(org.id);
          counts[org.id] = members.length;
        } catch {
          counts[org.id] = 0;
        }
      }
      setMembersCount(counts);
      setLoading(false);
    };
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Selecione uma organização</h1>
          <p className="text-muted-foreground">Escolha em qual organização deseja entrar agora.</p>
        </header>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {organizations.map((org) => (
            <OrganizationCard key={org.id} organization={org} members={membersCount[org.id] ?? 0} />
          ))}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default SelectOrganizationPage;
