
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Copy, Trash2 } from 'lucide-react';
import { Invitation } from '@/services/invitationService';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface InvitationTableRowProps {
  invitation: Invitation;
  onCopyLink: (invitation: Invitation) => void;
  onDeleteRequest: (invitation: Invitation) => void;
}

const InvitationTableRow: React.FC<InvitationTableRowProps> = ({ 
  invitation, 
  onCopyLink, 
  onDeleteRequest 
}) => {
  return (
    <TableRow key={invitation.id}>
      <TableCell className="font-medium">{invitation.name}</TableCell>
      <TableCell>{invitation.email}</TableCell>
      <TableCell>
        <Badge className={
          invitation.role === 'admin' 
            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            : invitation.role === 'editor'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
        }>
          {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
        </Badge>
      </TableCell>
      <TableCell>
        {formatDistanceToNow(new Date(invitation.created_at), { 
          addSuffix: true,
          locale: ptBR
        })}
      </TableCell>
      <TableCell>
        {formatDistanceToNow(new Date(invitation.expires_at), { 
          addSuffix: true,
          locale: ptBR 
        })}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onCopyLink(invitation)}>
              <Copy className="mr-2 h-4 w-4" />
              Copiar Link
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDeleteRequest(invitation)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remover
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default InvitationTableRow;
