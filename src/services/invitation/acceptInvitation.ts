
import { supabase } from '../../lib/supabase';
import { Member } from '../../types/organization';

/**
 * Aceita um convite de organização usando a Edge Function
 * @param token Token do convite (email)
 * @param userId ID do usuário que está aceitando (opcional)
 * @returns Resultado da aceitação
 */
export async function acceptInvitation(
  token: string, 
  userId?: string
): Promise<{ success: boolean; member?: Member; message?: string }> {
  try {
    console.log('[acceptInvitation] Iniciando processo de aceitação de convite', { token, userId });
    
    // Obter session do usuário atual para autenticação
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Usuário não autenticado');
    }

    // Chamar Edge Function para aceitar convite
    const { data, error } = await supabase.functions.invoke('accept-invitation', {
      body: { token, userId },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      console.error('[acceptInvitation] Erro na Edge Function:', error);
      throw error;
    }

    if (!data.success) {
      console.error('[acceptInvitation] Falha retornada pela Edge Function:', data.error);
      throw new Error(data.error || 'Erro ao aceitar convite');
    }

    console.log('[acceptInvitation] Convite aceito com sucesso:', data);
    
    return {
      success: true,
      member: data.member,
      message: data.message
    };
    
  } catch (error) {
    console.error('[acceptInvitation] Erro completo ao aceitar convite:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}
