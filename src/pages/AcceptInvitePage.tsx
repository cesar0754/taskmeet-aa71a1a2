
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useInvitationAccept } from '@/hooks/useInvitationAccept';
import InvitationDetails from '@/components/invitation/InvitationDetails';
import PasswordSetupForm from '@/components/invitation/PasswordSetupForm';

const AcceptInvitePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Verificar se há um token na URL
    const params = new URLSearchParams(location.search);
    const inviteToken = params.get('token');
    
    console.log('[AcceptInvitePage] Token na URL:', inviteToken);
    console.log('[AcceptInvitePage] Estado de autenticação:', { user: !!user, authLoading });
    
    // Se não há token, redirecionar para a página inicial
    if (!inviteToken) {
      console.error('[AcceptInvitePage] Nenhum token de convite encontrado na URL');
      navigate('/');
      return;
    }
    
    // Se o usuário não está autenticado e carregamento terminou, redirecionar para login
    if (!authLoading && !user) {
      const redirectPath = `/accept-invite?token=${inviteToken}`;
      console.log('[AcceptInvitePage] Usuário não autenticado. Redirecionando para login com retorno para:', redirectPath);
      navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`);
    }
  }, [user, authLoading, navigate, location.search]);
  
  const {
    invitation,
    loading,
    accepting,
    error,
    showPasswordForm,
    handleShowPasswordForm,
    handlePasswordSubmit,
  } = useInvitationAccept(user?.id);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Se o usuário não estiver autenticado, mostrar mensagem (antes do redirecionamento)
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>Você precisa estar autenticado para acessar esta página</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="warning" className="mb-4">
              <AlertTitle>Não autenticado</AlertTitle>
              <AlertDescription>Redirecionando para a página de login...</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md px-4">
        <Card>
          <CardHeader>
            <CardTitle>Convite para Organização</CardTitle>
            <CardDescription>
              {error ? 'Houve um problema com o convite' : 'Você foi convidado para participar de uma organização'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : invitation ? (
              <>
                {!showPasswordForm ? (
                  <InvitationDetails invitation={invitation} />
                ) : (
                  <PasswordSetupForm onSubmit={handlePasswordSubmit} isProcessing={accepting} />
                )}
              </>
            ) : null}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/')}>
              Cancelar
            </Button>
            {invitation && !error && !showPasswordForm && (
              <Button onClick={handleShowPasswordForm}>
                Continuar
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AcceptInvitePage;
