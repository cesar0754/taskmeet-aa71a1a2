import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se o usuário está logado, mostra o conteúdo público (permitindo acesso a páginas como register que redirecionam)
  // O redirecionamento será feito pela própria página
  return <>{children}</>;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se não está logado, redireciona para a LANDING PAGE (não para login)
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Se está logado, mostra o conteúdo protegido
  return <>{children}</>;
};

export { PublicRoute, ProtectedRoute };