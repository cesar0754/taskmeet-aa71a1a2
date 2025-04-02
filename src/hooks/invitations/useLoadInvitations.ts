
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getInvitationsByOrganization } from '@/services/invitation/getInvitation';
import { Invitation } from '@/types/invitation';

/**
 * Hook dedicado para o carregamento de convites da organização
 * @param organizationId ID da organização
 * @returns Estado dos convites e função para recarregá-los
 */
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
