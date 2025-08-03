
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook para gerenciar o processo de recuperação e atualização de senha
 * @returns Funções para resetar e atualizar senha
 */
export const usePasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log(`[usePasswordReset] Enviando solicitação de recuperação para: ${email}`);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        console.error('[usePasswordReset] Erro ao enviar email de recuperação:', error);
        toast({
          title: 'Erro',
          description: `Falha ao enviar email: ${error.message}`,
          variant: 'destructive',
        });
        return false;
      }

      console.log('[usePasswordReset] Email de recuperação enviado com sucesso');
      return true;
    } catch (error: any) {
      console.error('[usePasswordReset] Erro inesperado na recuperação de senha:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('[usePasswordReset] Atualizando senha');
      
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        console.error('[usePasswordReset] Erro ao atualizar senha:', error);
        toast({
          title: 'Erro',
          description: `Falha ao atualizar senha: ${error.message}`,
          variant: 'destructive',
        });
        return false;
      }

      console.log('[usePasswordReset] Senha atualizada com sucesso');
      return true;
    } catch (error: any) {
      console.error('[usePasswordReset] Erro inesperado na atualização de senha:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, updatePassword, loading };
};
