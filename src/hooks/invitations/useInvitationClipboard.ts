
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Invitation } from '@/types/invitation';

/**
 * Hook para gerenciar a cópia do link de convite para a área de transferência
 * @returns Função para copiar o link de convite
 */
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
