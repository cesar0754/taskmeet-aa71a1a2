
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook para gerenciar o estado de autenticação do usuário
 * @returns Estado de autenticação atual (user, session, loading)
 */
export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      
      try {
        // Configurar o listener para mudanças de autenticação PRIMEIRO
        const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
          if (newSession) {
            setSession(newSession);
            setUser(newSession.user);
          } else {
            setSession(null);
            setUser(null);
          }
        });
        
        // DEPOIS verificar se já existe uma sessão
        const { data: sessionData } = await supabase.auth.getSession();
        setSession(sessionData.session);
        setUser(sessionData.session?.user || null);
        
        return () => {
          data.subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Erro ao inicializar a autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return { user, session, loading };
};
