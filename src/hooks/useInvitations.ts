
import { useState, useEffect, useCallback } from 'react';
import { Invitation, getInvitationsByOrganization, deleteInvitation } from '@/services/invitationService';
import { useToast } from '@/hooks/use-toast';

export const useInvitations = (organizationId: string | undefined) => {
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<Invitation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadInvitations = useCallback(async () => {
    if (!organizationId) return;
    
    try {
      setLoading(true);
      console.log('Carregando convites para organização:', organizationId);
      const invitationsList = await getInvitationsByOrganization(organizationId);
      console.log('Convites carregados:', invitationsList?.length || 0);
      if (invitationsList) {
        setInvitations(invitationsList);
      } else {
        setInvitations([]);
      }
    } catch (error) {
      console.error('Erro ao carregar convites:', error);
      toast({
        title: 'Erro ao carregar convites',
        description: 'Não foi possível carregar a lista de convites.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [organizationId, toast]);

  const refreshInvitations = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (organizationId) {
      loadInvitations();
    }
  }, [organizationId, loadInvitations, refreshKey]);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      setIsDeleting(true);
      console.log('Removendo convite com ID:', deleteConfirm.id);
      
      // Atualiza a UI imediatamente
      setInvitations(prevInvitations => 
        prevInvitations.filter(inv => inv.id !== deleteConfirm.id)
      );
      
      const success = await deleteInvitation(deleteConfirm.id);
      
      if (success) {
        toast({
          title: 'Convite removido',
          description: 'O convite foi removido com sucesso.',
        });
      } else {
        toast({
          title: 'Erro ao remover convite',
          description: 'Houve um problema ao remover o convite. A lista será atualizada.',
          variant: 'destructive',
        });
        
        loadInvitations();
      }
    } catch (error) {
      console.error('Erro ao remover convite:', error);
      toast({
        title: 'Erro ao remover convite',
        description: 'Houve um problema ao remover o convite.',
        variant: 'destructive',
      });
      
      loadInvitations();
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  const copyInviteLink = (invitation: Invitation) => {
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
  };

  return {
    invitations,
    loading,
    deleteConfirm,
    isDeleting,
    setDeleteConfirm,
    handleDelete,
    copyInviteLink,
    refreshInvitations
  };
};
