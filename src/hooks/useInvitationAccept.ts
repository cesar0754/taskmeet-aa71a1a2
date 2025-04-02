
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getInvitationByToken, acceptInvitation, Invitation } from '@/services/invitation';
import { PasswordFormValues } from '@/components/invitation/PasswordSetupForm';

export const useInvitationAccept = (userId: string | undefined) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const inviteToken = params.get('token');
        
        if (!inviteToken) {
          console.error('[useInvitationAccept] Token de convite não fornecido');
          setError('Token de convite não fornecido');
          setLoading(false);
          return;
        }
        
        setToken(inviteToken);
        console.log('[useInvitationAccept] Buscando convite com token:', inviteToken);
        const invitationData = await getInvitationByToken(inviteToken);
        
        if (!invitationData) {
          console.error('[useInvitationAccept] Convite não encontrado ou expirado. Token:', inviteToken);
          setError('Convite inválido ou expirado');
          setLoading(false);
          return;
        }
        
        console.log('[useInvitationAccept] Convite encontrado:', invitationData);
        setInvitation(invitationData);
      } catch (error) {
        console.error('[useInvitationAccept] Erro ao buscar convite:', error);
        setError('Erro ao buscar detalhes do convite');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [location.search]);

  const handleShowPasswordForm = () => {
    setShowPasswordForm(true);
  };

  const handlePasswordSubmit = async (data: PasswordFormValues) => {
    if (!userId || !invitation || !token) {
      console.error('[useInvitationAccept] Dados faltantes:', { userId, hasInvitation: !!invitation, token });
      setError('Dados incompletos para aceitar o convite');
      return;
    }

    try {
      setAccepting(true);
      
      console.log('[useInvitationAccept] Aceitando convite com token:', token);
      console.log('[useInvitationAccept] Dados de usuário e convite:', { 
        userId, 
        invitation: { 
          id: invitation.id, 
          email: invitation.email, 
          organization_id: invitation.organization_id 
        } 
      });
      
      const result = await acceptInvitation(token, userId, data.password);
      
      if (!result) {
        console.error('[useInvitationAccept] Resultado da aceitação é nulo');
        throw new Error('Erro ao aceitar convite');
      }
      
      console.log('[useInvitationAccept] Convite aceito com sucesso:', result);
      
      toast({
        title: 'Convite aceito',
        description: 'Você agora é membro da organização com sua senha definida!',
      });
      
      // Redirecionar para o dashboard com parâmetro de organização
      navigate(`/dashboard?org=${invitation.organization_id}`);
    } catch (error) {
      console.error('[useInvitationAccept] Erro detalhado ao aceitar convite:', error);
      toast({
        title: 'Erro ao aceitar convite',
        description: 'Houve um problema ao processar seu convite.',
        variant: 'destructive',
      });
      setError('Houve um problema ao processar seu convite. Por favor, tente novamente mais tarde.');
    } finally {
      setAccepting(false);
    }
  };

  return {
    invitation,
    loading,
    accepting,
    error,
    showPasswordForm,
    token,
    handleShowPasswordForm,
    handlePasswordSubmit,
  };
};
