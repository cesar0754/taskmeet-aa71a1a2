
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook para gerenciar o processo de logout
 * @returns Função de logout e estado de carregamento
 */
export const useSignOut = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Redireciona para a landing page após o logout
      navigate('/', { replace: true });
      
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
