
import { supabase } from '../../lib/supabase';

/**
 * Marca um convite como utilizado e atualiza o status 
 * do membro correspondente na organização
 * @param invitationId ID do convite a ser marcado como utilizado
 * @returns Um status indicando se a operação foi bem-sucedida
 */
export async function markInvitationAsUsed(invitationId: string): Promise<boolean> {
  try {
    console.log('[markInvitationAsUsed] Marcando convite como utilizado');
    
    // Obter informações do convite para depois atualizar o membro
    const { data: invitation, error: getError } = await supabase
      .from('member_invitations')
      .select('id, organization_id, email')
      .eq('id', invitationId)
      .single();
    
    if (getError || !invitation) {
      console.error('[markInvitationAsUsed] Erro ao buscar convite:', getError);
      return false;
    }
    
    // Marcar o convite como utilizado
    const { error: updateError } = await supabase
      .from('member_invitations')
      .update({ used_at: new Date().toISOString() })
      .eq('id', invitationId);
      
    if (updateError) {
      console.error('[markInvitationAsUsed] Erro ao atualizar convite:', updateError);
      return false;
    }
    
    // Atualizar o status do membro para não pendente
    const { error: memberError } = await supabase
      .from('organization_members')
      .update({ 
        pending: false,
        is_first_login: false 
      })
      .eq('organization_id', invitation.organization_id)
      .eq('email', invitation.email);
    
    if (memberError) {
      console.error('[markInvitationAsUsed] Erro ao atualizar status do membro:', memberError);
      return false;
    }
    
    console.log('[markInvitationAsUsed] Convite marcado como utilizado e membro atualizado com sucesso');
    return true;
  } catch (error) {
    console.error('[markInvitationAsUsed] Erro ao marcar convite como utilizado:', error);
    return false;
  }
}
