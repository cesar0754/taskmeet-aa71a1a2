
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getInvitationByToken } from '@/services/invitation';
import { Invitation } from '@/types/invitation';

export const useInvitation = (token: string | null) => {
  const { toast } = useToast();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        if (!token) {
          console.error('[useInvitation] Token de convite não fornecido');
          setError('Token de convite não fornecido');
          setLoading(false);
          return;
        }
        
        console.log('[useInvitation] Buscando convite com token:', token);
        const invitationData = await getInvitationByToken(token);
        
        if (!invitationData) {
          console.error('[useInvitation] Convite não encontrado ou expirado. Token:', token);
          setError('Convite inválido ou expirado');
          setLoading(false);
          return;
        }
        
        console.log('[useInvitation] Convite encontrado:', invitationData);
        setInvitation(invitationData);
      } catch (error) {
        console.error('[useInvitation] Erro ao buscar convite:', error);
        setError('Erro ao buscar detalhes do convite');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [token, toast]);

  return {
    invitation,
    loading,
    error
  };
};
