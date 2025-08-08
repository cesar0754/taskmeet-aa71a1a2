
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
    let mounted = true;
    
    // Configurar o listener para mudanças de autenticação PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event, newSession?.user?.email);
      
      if (newSession) {
        setSession(newSession);
        setUser(newSession.user);
        
        // Se o evento é de confirmação de email, redirecionar para criar organização
        if (event === 'SIGNED_IN' && newSession.user.email_confirmed_at) {
          // Verificar se o usuário já tem organização
          const { fetchUserOrganizations } = await import('@/services/organization/organizationService');
          try {
            const existingOrg = await fetchUserOrganizations(newSession.user.id);
            if (!existingOrg) {
              // Se não tem organização, redirecionar para criar organização
              window.location.href = '/create-organization';
            }
          } catch (error) {
            console.error('Erro ao verificar organizações:', error);
            // Em caso de erro, redirecionar para criar organização por segurança
            window.location.href = '/create-organization';
          }
        }
      } else {
        setSession(null);
        setUser(null);
      }
      setLoading(false);
    });
    
    // DEPOIS verificar se já existe uma sessão
    const getInitialSession = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!mounted) return;
        
        console.log('Initial session:', sessionData.session?.user?.email);
        
        setSession(sessionData.session);
        setUser(sessionData.session?.user || null);
      } catch (error) {
        console.error('Erro ao obter sessão inicial:', error);
        if (!mounted) return;
        setSession(null);
        setUser(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, loading };
};
