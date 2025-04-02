
import { supabase } from '../../lib/supabase';
import { getInvitationByToken } from './getInvitation';
import { Member } from '../../types/organization';

export async function acceptInvitation(
  token: string, 
  userId: string
): Promise<Member | null> {
  try {
    // Buscar o convite
    const invitation = await getInvitationByToken(token);
    if (!invitation) {
      throw new Error('Convite inválido ou expirado');
    }

    // Iniciar uma transação
    const { data: memberData, error: memberError } = await supabase
      .from('organization_members')
      .insert([
        { 
          organization_id: invitation.organization_id, 
          user_id: userId,
          email: invitation.email,
          name: invitation.name,
          role: invitation.role,
          pending: false
        }
      ])
      .select()
      .single();

    if (memberError) {
      console.error('Erro ao adicionar membro:', memberError);
      throw memberError;
    }

    // Marcar o convite como utilizado
    const { error: updateError } = await supabase
      .from('member_invitations')
      .update({ used_at: new Date().toISOString() })
      .eq('id', invitation.id);

    if (updateError) {
      console.error('Erro ao atualizar convite:', updateError);
      throw updateError;
    }

    return memberData;
  } catch (error) {
    console.error('Erro ao aceitar convite:', error);
    return null;
  }
}
