
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { resendInvitation } from '@/services/invitation';
import { Invitation } from '@/types/invitation';

/**
 * Hook para gerenciar o reenvio de convites
 * @param refreshCallback Função para atualizar a lista de convites após o reenvio
 * @returns Estado e handler para o processo de reenvio de convites
 */
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
