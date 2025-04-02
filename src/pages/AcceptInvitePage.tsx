
import React from 'react';
import { useNavigate } from 'react-router-dom';
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

  // Redirecionar para login se o usuário não estiver autenticado
  if (!user) {
    const params = new URLSearchParams(window.location.search);
    const inviteToken = params.get('token');
    const redirectPath = `/accept-invite?token=${inviteToken}`;
    console.log('[AcceptInvitePage] Redirecionando para login com retorno para:', redirectPath);
    navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`);
    return null;
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
