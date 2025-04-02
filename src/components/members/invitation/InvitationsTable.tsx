
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Invitation } from '@/services/invitationService';
import InvitationTableRow from './InvitationTableRow';

interface InvitationsTableProps {
  invitations: Invitation[];
  onCopyLink: (invitation: Invitation) => void;
  onDeleteRequest: (invitation: Invitation) => void;
}

const InvitationsTable: React.FC<InvitationsTableProps> = ({ 
  invitations, 
  onCopyLink, 
  onDeleteRequest 
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Função</TableHead>
          <TableHead>Enviado</TableHead>
          <TableHead>Expira</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
              Nenhum convite pendente encontrado
            </TableCell>
          </TableRow>
        ) : (
          invitations.map((invitation) => (
            <InvitationTableRow 
              key={invitation.id}
              invitation={invitation}
              onCopyLink={onCopyLink}
              onDeleteRequest={onDeleteRequest}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default InvitationsTable;
