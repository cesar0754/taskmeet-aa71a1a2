
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useOrganization } from '@/context/OrganizationContext';
import MembersList from '@/components/members/MembersList';
import AddMemberForm from '@/components/members/AddMemberForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus } from 'lucide-react';

const MembersPage: React.FC = () => {
  const { organization, members, loading } = useOrganization();
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
          title="Membros da Organização"
          description="Gerencie os membros da sua organização e suas permissões de acesso."
          action={
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus size={18} />
                  Adicionar Membro
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Membro</DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes do novo membro para enviar um convite.
                  </DialogDescription>
                </DialogHeader>
                <AddMemberForm onSuccess={() => setOpen(false)} />
              </DialogContent>
            </Dialog>
          }
        />

        <MembersList />
      </div>
    </DashboardLayout>
  );
};

export default MembersPage;
