import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useOrganization } from '@/context/OrganizationContext';
import GroupsList from '@/components/groups/GroupsList';
import GroupForm from '@/components/groups/GroupForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users } from 'lucide-react';

const GroupsPage: React.FC = () => {
  const { organization, loading } = useOrganization();
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHeader
          title="Grupos da Organização"
          description="Organize seus membros em grupos para facilitar a colaboração e gestão de permissões."
          action={
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Users size={18} />
                  Criar Grupo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Grupo</DialogTitle>
                  <DialogDescription>
                    Crie um grupo para organizar os membros da sua organização.
                  </DialogDescription>
                </DialogHeader>
                <GroupForm 
                  onSuccess={() => setOpen(false)}
                />
              </DialogContent>
            </Dialog>
          }
        />

        <GroupsList />
      </div>
    </DashboardLayout>
  );
};

export default GroupsPage;