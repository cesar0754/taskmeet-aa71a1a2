
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook para gerenciar o processo de logout
 * @returns Função de logout e estado de carregamento
 */
export const useSignOut = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast({
        title: 'Logout bem-sucedido',
        description: 'Volte em breve!',
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Erro ao fazer logout',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { signOut, loading };
};
