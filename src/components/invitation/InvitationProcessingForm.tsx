
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Invitation } from '@/types/invitation';

interface InvitationProcessingFormProps {
  invitation: Invitation;
  token: string;
}

const InvitationProcessingForm: React.FC<InvitationProcessingFormProps> = ({ invitation, token }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAcceptInvitation = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      
      console.log('[InvitationProcessingForm] Aceitando convite com token:', token);
      
      // Chamar a função do Supabase para aceitar o convite
      const { data, error: functionError } = await supabase.functions.invoke('accept-invitation', {
        body: { 
          token,
          userId: 'default' // O valor será substituído na Edge Function pelo usuário atual
        }
      });
      
      if (functionError) {
        console.error('[InvitationProcessingForm] Erro ao aceitar convite:', functionError);
        setError('Ocorreu um erro ao aceitar o convite. Por favor, tente novamente.');
        return;
      }
      
      console.log('[InvitationProcessingForm] Convite aceito com sucesso:', data);
      
      toast({
        title: 'Convite aceito',
        description: 'Você agora é membro da organização!',
      });
      
      // Redirecionar para o dashboard com parâmetro de organização
      navigate(`/dashboard?org=${invitation.organization_id}`);
    } catch (error: any) {
      console.error('[InvitationProcessingForm] Erro ao processar convite:', error);
      setError(error.message || 'Ocorreu um erro ao processar sua solicitação.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => navigate('/')}>
          Cancelar
        </Button>
        <Button onClick={handleAcceptInvitation} disabled={isProcessing}>
          {isProcessing ? 'Processando...' : 'Aceitar convite'}
        </Button>
      </div>
    </div>
  );
};

export default InvitationProcessingForm;
