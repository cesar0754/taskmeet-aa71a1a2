
import React from 'react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Invitation } from '@/types/invitation';

interface DeleteInvitationDialogProps {
  invitation: Invitation | null;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
}

const DeleteInvitationDialog: React.FC<DeleteInvitationDialogProps> = ({
  invitation,
  isDeleting,
  onOpenChange,
  onConfirmDelete
}) => {
  return (
    <AlertDialog 
      open={!!invitation} 
      onOpenChange={(open) => {
        if (!open && !isDeleting) {
          onOpenChange(open);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. O convite será removido permanentemente e o usuário não poderá mais utilizá-lo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={onConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Removendo...' : 'Sim, remover convite'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteInvitationDialog;
