
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Invitation } from '@/types/invitation';
import { acceptInvitation } from '@/services/invitation/acceptInvitation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { profileService } from '@/services/profileService';

interface InvitationProcessingFormProps {
  invitation: Invitation;
  token: string;
}

const InvitationProcessingForm: React.FC<InvitationProcessingFormProps> = ({ invitation, token }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const isEmailMismatch = !!(user?.email && invitation.email && user.email.toLowerCase() !== invitation.email.toLowerCase());

  const handleAcceptInvitation = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      if (isEmailMismatch) {
        setError(`Este convite é para ${invitation.email}. Por favor, entre com esse e-mail para aceitar.`);
        return;
      }
      
      console.log('[InvitationProcessingForm] Aceitando convite com token:', token);
      
      const result = await acceptInvitation(token, invitation.organization_id);

      if (!result.success) {
        console.error('[InvitationProcessingForm] Falha ao aceitar convite:', result.message);
        setError(result.message || 'Ocorreu um erro ao aceitar o convite. Por favor, tente novamente.');
        return;
      }

      // Garantir que o perfil reflita os dados do convite
      if (user?.id) {
        try {
          await profileService.updateProfile(user.id, {
            name: invitation.name,
            email: invitation.email,
          });
        } catch (e) {
          console.warn('[InvitationProcessingForm] Não foi possível atualizar o perfil após aceitar:', e);
        }
      }

      console.log('[InvitationProcessingForm] Convite aceito com sucesso:', result);

      toast({
        title: 'Convite aceito',
        description: 'Você agora é membro da organização!',
      });
      
      navigate(`/dashboard?org=${invitation.organization_id}`);
    } catch (error: any) {
      console.error('[InvitationProcessingForm] Erro ao processar convite:', error);
      setError(error.message || 'Ocorreu um erro ao processar sua solicitação.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSwitchToInvitee = async () => {
    try {
      setIsProcessing(true);
      await supabase.auth.signOut();
      // Redireciona para a mesma página, abrindo o formulário de registro
      navigate(`/accept-invite?token=${encodeURIComponent(token)}&register=1`, { replace: true });
    } catch (e) {
      console.error('[InvitationProcessingForm] Erro ao alternar para convidado:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {isEmailMismatch && (
        <Alert variant="default">
          <AlertTitle>Atenção</AlertTitle>
          <AlertDescription>
            Este convite foi enviado para <strong>{invitation.email}</strong>, mas você está logado como <strong>{user?.email}</strong>.
            Para aceitar, entre com o e-mail do convite.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => navigate('/')}>Cancelar</Button>
        {isEmailMismatch ? (
          <Button onClick={handleSwitchToInvitee} disabled={isProcessing}>
            {isProcessing ? 'Processando...' : `Entrar como ${invitation.email}`}
          </Button>
        ) : (
          <Button onClick={handleAcceptInvitation} disabled={isProcessing}>
            {isProcessing ? 'Processando...' : 'Aceitar convite'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default InvitationProcessingForm;
