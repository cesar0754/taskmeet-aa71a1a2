
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useInvitationAccept } from '@/hooks/useInvitationAccept';
import InvitationDetails from '@/components/invitation/InvitationDetails';
import PasswordSetupForm from '@/components/invitation/PasswordSetupForm';
import { supabase } from '@/lib/supabase';
import { getInvitationByToken } from '@/services/invitation/getInvitation';
import { Invitation } from '@/types/invitation';

const AcceptInvitePage: React.FC = () => {
  const { user, loading: authLoading, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchInvitationDetails = async () => {
      try {
        // Extrair token da URL
        const params = new URLSearchParams(location.search);
        const inviteToken = params.get('token');
        
        console.log('[AcceptInvitePage] Token na URL:', inviteToken);
        
        if (!inviteToken) {
          console.error('[AcceptInvitePage] Nenhum token de convite encontrado na URL');
          setError('Link de convite inválido ou expirado.');
          setLoading(false);
          return;
        }
        
        setToken(inviteToken);
        
        // Buscar detalhes do convite
        const invitationData = await getInvitationByToken(inviteToken);
        
        if (!invitationData) {
          console.error('[AcceptInvitePage] Convite não encontrado ou expirado');
          setError('Este convite não é válido ou já expirou.');
          setLoading(false);
          return;
        }
        
        console.log('[AcceptInvitePage] Convite encontrado:', invitationData);
        setInvitation(invitationData);
        
        // Se o usuário já estiver autenticado, use o hook useInvitationAccept
        if (user) {
          console.log('[AcceptInvitePage] Usuário já autenticado, utilizando useInvitationAccept');
          // Aqui não fazemos nada especial, pois o restante do componente
          // vai lidar com usuários autenticados
        } else {
          console.log('[AcceptInvitePage] Usuário não autenticado, mostrando formulário de senha');
          // Para usuários não autenticados, mostramos diretamente o formulário de senha
          setShowPasswordForm(true);
        }
      } catch (error) {
        console.error('[AcceptInvitePage] Erro ao processar convite:', error);
        setError('Ocorreu um erro ao processar o convite.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitationDetails();
  }, [location.search, user]);
  
  const handlePasswordSubmit = async (data: { password: string; confirmPassword: string }) => {
    if (!invitation || !token) {
      setError('Dados do convite não encontrados.');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      if (!user) {
        // Se não há usuário autenticado, primeiro registramos o usuário
        console.log('[AcceptInvitePage] Registrando novo usuário com email:', invitation.email);
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: invitation.email,
          password: data.password,
          options: {
            data: {
              name: invitation.name
            }
          }
        });
        
        if (signUpError) {
          console.error('[AcceptInvitePage] Erro ao registrar usuário:', signUpError);
          throw new Error(signUpError.message);
        }
        
        if (!authData.user) {
          throw new Error('Falha ao criar usuário.');
        }
        
        console.log('[AcceptInvitePage] Usuário registrado com sucesso:', authData.user.id);
        
        // Após registro bem-sucedido, aceitar o convite
        const { data: acceptData, error: acceptError } = await supabase.functions.invoke('accept-invitation', {
          body: { 
            token,
            userId: authData.user.id
          }
        });
        
        if (acceptError) {
          console.error('[AcceptInvitePage] Erro ao aceitar convite:', acceptError);
          throw new Error('Erro ao aceitar convite.');
        }
        
        console.log('[AcceptInvitePage] Convite aceito com sucesso:', acceptData);
        
        // Login automático após registro
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: invitation.email,
          password: data.password
        });
        
        if (signInError) {
          console.error('[AcceptInvitePage] Erro ao fazer login automático:', signInError);
          // Não interrompemos o fluxo se o login automático falhar
        }
        
        // Redirecionar para o dashboard
        navigate(`/dashboard?org=${invitation.organization_id}`);
      } else {
        // Se já existe um usuário autenticado, usamos o hook para aceitar o convite
        const acceptHook = useInvitationAccept(user.id);
        await acceptHook.handlePasswordSubmit(data);
        
        // Redirecionar para o dashboard
        navigate(`/dashboard?org=${invitation.organization_id}`);
      }
    } catch (error: any) {
      console.error('[AcceptInvitePage] Erro ao processar senha:', error);
      setError(error.message || 'Ocorreu um erro ao processar sua solicitação.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
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
                  <PasswordSetupForm onSubmit={handlePasswordSubmit} isProcessing={isProcessing} />
                )}
              </>
            ) : null}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/')}>
              Cancelar
            </Button>
            {invitation && !error && !showPasswordForm && (
              <Button onClick={() => setShowPasswordForm(true)}>
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
