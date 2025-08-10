import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { fetchUserOrganizations } from '@/services/organization/organizationService';

const AuthCallbackPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (loading) return;
      
      if (!user) {
        console.log('[AuthCallback] Usuário não autenticado, redirecionando para landing');
        navigate('/');
        return;
      }

      console.log('[AuthCallback] Usuário autenticado, verificando organizações');
      
      try {
        const org = await fetchUserOrganizations(user.id);
        if (org) {
          console.log('[AuthCallback] Organização encontrada, redirecionando para dashboard');
          navigate('/dashboard');
        } else {
          console.log('[AuthCallback] Nenhuma organização encontrada, redirecionando para criar organização');
          navigate('/create-organization');
        }
      } catch (error) {
        console.error('[AuthCallback] Erro ao verificar organizações:', error);
        console.log('[AuthCallback] Redirecionando para criar organização por segurança');
        navigate('/create-organization');
      }
    };

    handleAuthCallback();
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Processando autenticação...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallbackPage;