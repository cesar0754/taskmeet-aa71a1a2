
import { supabase } from '../../lib/supabase';

/**
 * Marca um convite como utilizado
 * @param invitationId ID do convite a ser marcado como utilizado
 * @returns Um status indicando se a operação foi bem-sucedida
 */
export async function markInvitationAsUsed(invitationId: string): Promise<boolean> {
  try {
    console.log('[markInvitationAsUsed] Marcando convite como utilizado');
    
    const { error } = await supabase
      .from('member_invitations')
      .update({ used_at: new Date().toISOString() })
      .eq('id', invitationId);
      
    if (error) {
      console.error('[markInvitationAsUsed] Erro ao atualizar convite:', error);
      return false;
    }
    
    console.log('[markInvitationAsUsed] Convite marcado como utilizado com sucesso');
    return true;
  } catch (error) {
    console.error('[markInvitationAsUsed] Erro ao marcar convite como utilizado:', error);
    return false;
  }
}
