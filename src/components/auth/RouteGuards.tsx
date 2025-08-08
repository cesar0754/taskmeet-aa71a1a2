import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('PublicRoute - loading:', loading, 'user:', user?.email);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se o usuário está logado, redireciona para o dashboard
  if (user) {
    console.log('PublicRoute - Redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('PublicRoute - Showing public content');
  // Se não está logado, mostra o conteúdo público
  return <>{children}</>;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('ProtectedRoute - loading:', loading, 'user:', user?.email);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se não está logado, redireciona para a landing page
  if (!user) {
    console.log('ProtectedRoute - Redirecting to landing page');
    return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute - Showing protected content');
  // Se está logado, mostra o conteúdo protegido
  return <>{children}</>;
};

export { PublicRoute, ProtectedRoute };