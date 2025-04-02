
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      
      try {
        // Configurar o listener para mudanças de autenticação PRIMEIRO
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
          if (newSession) {
            setSession(newSession);
            setUser(newSession.user);
          } else {
            setSession(null);
            setUser(null);
          }
        });
        
        // DEPOIS verificar se já existe uma sessão
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user || null);
      } catch (error) {
        console.error('Erro ao inicializar a autenticação:', error);
      } finally {
        setLoading(false);
      }
      
      return () => {
        subscription.unsubscribe();
      };
    };

    initAuth();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: 'Erro ao fazer login',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      // Não precisamos definir o estado aqui, o listener onAuthStateChange fará isso
      toast({
        title: 'Login bem-sucedido',
        description: 'Bem-vindo de volta!',
      });
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        toast({
          title: 'Erro ao criar conta',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      toast({
        title: 'Conta criada com sucesso',
        description: 'Agora você pode criar sua organização.',
      });

      // Não precisamos definir o estado aqui, o listener onAuthStateChange fará isso
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Não precisamos definir o estado aqui, o listener onAuthStateChange fará isso
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

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log(`[AuthContext] Enviando solicitação de recuperação para: ${email}`);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        console.error('[AuthContext] Erro ao enviar email de recuperação:', error);
        toast({
          title: 'Erro',
          description: `Falha ao enviar email: ${error.message}`,
          variant: 'destructive',
        });
        return false;
      }

      console.log('[AuthContext] Email de recuperação enviado com sucesso');
      return true;
    } catch (error: any) {
      console.error('[AuthContext] Erro inesperado na recuperação de senha:', error);
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
      console.log('[AuthContext] Atualizando senha');
      
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        console.error('[AuthContext] Erro ao atualizar senha:', error);
        toast({
          title: 'Erro',
          description: `Falha ao atualizar senha: ${error.message}`,
          variant: 'destructive',
        });
        return false;
      }

      console.log('[AuthContext] Senha atualizada com sucesso');
      return true;
    } catch (error: any) {
      console.error('[AuthContext] Erro inesperado na atualização de senha:', error);
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

  const value = {
    user,
    session,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
