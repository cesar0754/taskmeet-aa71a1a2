import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { deleteInvitation, resendInvitation } from '@/services/invitation';
import { getInvitationsByOrganization } from '@/services/invitation/getInvitation';
import { Invitation } from '@/types/invitation';

// Hook dedicado para o carregamento de convites
export const useLoadInvitations = (organizationId: string | undefined) => {
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadInvitations = useCallback(async () => {
    if (!organizationId) return;
    
    try {
      setLoading(true);
      console.log('[loadInvitations] Carregando convites para organização:', organizationId, 'refreshKey:', refreshKey);
      const invitationsList = await getInvitationsByOrganization(organizationId);
      console.log('[loadInvitations] Convites carregados:', invitationsList?.length || 0, 'dados:', invitationsList);
      
      if (invitationsList) {
        setInvitations(invitationsList);
      } else {
        setInvitations([]);
      }
    } catch (error) {
      console.error('[loadInvitations] Erro ao carregar convites:', error);
      toast({
        title: 'Erro ao carregar convites',
        description: 'Não foi possível carregar a lista de convites.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [organizationId, toast, refreshKey]);

  const refreshInvitations = useCallback(() => {
    console.log('[refreshInvitations] Incrementando refreshKey para forçar recarga');
    setRefreshKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    console.log('[useEffect] Efeito disparado, organizationId:', organizationId, 'refreshKey:', refreshKey);
    if (organizationId) {
      loadInvitations();
    }
  }, [organizationId, loadInvitations, refreshKey]);

  return {
    invitations,
    loading,
    refreshInvitations
  };
};

// Hook dedicado para a remoção de convites
export const useDeleteInvitation = (refreshCallback: () => void) => {
  const { toast } = useToast();
  const [deleteConfirm, setDeleteConfirm] = useState<Invitation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      setIsDeleting(true);
      console.log('[handleDelete] Removendo convite com ID:', deleteConfirm.id);
      
      const success = await deleteInvitation(deleteConfirm.id);
      
      if (success) {
        console.log('[handleDelete] Convite removido com sucesso, chamando refreshCallback');
        toast({
          title: 'Convite removido',
          description: 'O convite foi removido com sucesso.',
        });
        
        refreshCallback();
      } else {
        console.error('[handleDelete] Falha ao remover convite, chamando refreshCallback mesmo assim');
        toast({
          title: 'Erro ao remover convite',
          description: 'Houve um problema ao remover o convite. A lista será atualizada.',
          variant: 'destructive',
        });
        
        refreshCallback();
      }
    } catch (error) {
      console.error('[handleDelete] Erro completo ao remover convite:', error);
      toast({
        title: 'Erro ao remover convite',
        description: 'Houve um problema ao remover o convite.',
        variant: 'destructive',
      });
      
      refreshCallback();
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  return {
    deleteConfirm,
    isDeleting,
    setDeleteConfirm,
    handleDelete
  };
};

// Hook para gerenciar o reenvio de convites
export const useResendInvitation = (refreshCallback: () => void) => {
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);

  const handleResend = async (invitation: Invitation) => {
    try {
      setIsResending(true);
      console.log('[handleResend] Reenviando convite com ID:', invitation.id);
      
      const success = await resendInvitation(invitation.id);
      
      if (success) {
        console.log('[handleResend] Convite reenviado com sucesso');
        toast({
          title: 'Convite reenviado',
          description: `O convite para ${invitation.email} foi reenviado com sucesso.`,
        });
      } else {
        console.error('[handleResend] Falha ao reenviar convite');
        toast({
          title: 'Erro ao reenviar convite',
          description: 'Houve um problema ao reenviar o convite.',
          variant: 'destructive',
        });
      }
      
      refreshCallback();
    } catch (error) {
      console.error('[handleResend] Erro completo ao reenviar convite:', error);
      toast({
        title: 'Erro ao reenviar convite',
        description: 'Houve um problema ao reenviar o convite.',
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };

  return {
    isResending,
    handleResend
  };
};

// Hook para gerenciar o clipboard
export const useInvitationClipboard = () => {
  const { toast } = useToast();

  const copyInviteLink = useCallback((invitation: Invitation) => {
    const baseUrl = window.location.origin;
    const inviteLink = `${baseUrl}/accept-invite?token=${invitation.token}`;
    
    navigator.clipboard.writeText(inviteLink).then(
      () => {
        toast({
          title: 'Link copiado',
          description: 'Link de convite copiado para a área de transferência.',
        });
      },
      () => {
        toast({
          title: 'Falha ao copiar',
          description: 'Não foi possível copiar o link para a área de transferência.',
          variant: 'destructive',
        });
      }
    );
  }, [toast]);

  return { copyInviteLink };
};

// Hook principal que combina os hooks anteriores
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
