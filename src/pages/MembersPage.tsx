
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useOrganization } from '@/context/OrganizationContext';
import MembersList from '@/components/members/MembersList';
import AddMemberForm from '@/components/members/AddMemberForm';
import InvitationsList from '@/components/members/InvitationsList';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus } from 'lucide-react';

const MembersPage: React.FC = () => {
  const { organization, loading } = useOrganization();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('members');
  const [refreshKey, setRefreshKey] = useState(0);

  // Função para forçar uma atualização da página
  const refreshPage = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Reset do estado quando o diálogo é fechado
  useEffect(() => {
    if (!open) {
      // Se o diálogo foi fechado após sucesso, espera um pouco e 
      // muda para aba de convites para mostrar o novo convite
      const timer = setTimeout(() => {
        refreshPage();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [open]);

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
                <AddMemberForm 
                  onSuccess={() => {
                    setOpen(false);
                    setActiveTab('invitations');
                    refreshPage();
                  }} 
                />
              </DialogContent>
            </Dialog>
          }
        />

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
          key={`tabs-container-${refreshKey}`}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="members">Membros Ativos</TabsTrigger>
            <TabsTrigger value="invitations">Convites Pendentes</TabsTrigger>
          </TabsList>
          <TabsContent value="members" className="mt-4">
            <MembersList key={`members-list-${refreshKey}`} />
          </TabsContent>
          <TabsContent value="invitations" className="mt-4">
            <InvitationsList key={`invitations-list-${refreshKey}`} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MembersPage;
