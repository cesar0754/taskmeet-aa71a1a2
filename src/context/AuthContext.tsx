
import React, { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useAuthState } from '@/hooks/auth/useAuthState';
import { useSignIn } from '@/hooks/auth/useSignIn';
import { useSignUp } from '@/hooks/auth/useSignUp';
import { useSignOut } from '@/hooks/auth/useSignOut';
import { usePasswordReset } from '@/hooks/auth/usePasswordReset';

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
  // Utilizando os hooks específicos para cada funcionalidade
  const { user, session, loading: authLoading } = useAuthState();
  const { signIn, loading: signInLoading } = useSignIn();
  const { signUp, loading: signUpLoading } = useSignUp();
  const { signOut, loading: signOutLoading } = useSignOut();
  const { resetPassword, updatePassword, loading: passwordLoading } = usePasswordReset();
  
  // Calculando o estado de loading global
  const loading = authLoading || signInLoading || signUpLoading || signOutLoading || passwordLoading;

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
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
