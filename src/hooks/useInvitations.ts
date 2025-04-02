
import { useLoadInvitations } from './invitations/useLoadInvitations';
import { useDeleteInvitation } from './invitations/useDeleteInvitation';
import { useResendInvitation } from './invitations/useResendInvitation';
import { useInvitationClipboard } from './invitations/useInvitationClipboard';

/**
 * Hook principal que combina os hooks específicos para gerenciar convites
 * @param organizationId ID da organização
 * @returns Todos os estados e funções para gerenciar convites
 */
export const useInvitations = (organizationId: string | undefined) => {
  const { invitations, loading, refreshInvitations } = useLoadInvitations(organizationId);
  const { deleteConfirm, isDeleting, setDeleteConfirm, handleDelete } = useDeleteInvitation(refreshInvitations);
  const { isResending, handleResend } = useResendInvitation(refreshInvitations);
  const { copyInviteLink } = useInvitationClipboard();

  return {
    invitations,
    loading,
    deleteConfirm,
    isDeleting,
    isResending,
    setDeleteConfirm,
    handleDelete,
    handleResend,
    copyInviteLink,
    refreshInvitations
  };
};
