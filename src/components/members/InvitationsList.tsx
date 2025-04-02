
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrganization } from '@/context/OrganizationContext';
import { useInvitations } from '@/hooks/useInvitations';
import InvitationsTable from './invitation/InvitationsTable';
import DeleteInvitationDialog from './invitation/DeleteInvitationDialog';

const InvitationsList: React.FC = () => {
  const { organization } = useOrganization();
  
  const {
    invitations,
    loading,
    deleteConfirm,
    isDeleting,
    isResending,
    setDeleteConfirm,
    handleDelete,
    handleResend,
    copyInviteLink
  } = useInvitations(organization?.id);

  if (loading && invitations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Convites Pendentes</CardTitle>
          <CardDescription>
            Carregando convites...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Convites Pendentes</CardTitle>
          <CardDescription>
            Convites enviados que ainda não foram aceitos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvitationsTable 
            invitations={invitations}
            onCopyLink={copyInviteLink}
            onDeleteRequest={setDeleteConfirm}
            onResend={handleResend}
            isResending={isResending}
          />
        </CardContent>
      </Card>

      <DeleteInvitationDialog
        invitation={deleteConfirm}
        isDeleting={isDeleting}
        onOpenChange={() => setDeleteConfirm(null)}
        onConfirmDelete={handleDelete}
      />
    </>
  );
};

export default InvitationsList;
