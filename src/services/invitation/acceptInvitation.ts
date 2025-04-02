
import { supabase } from '../../lib/supabase';
import { getInvitationByToken } from './getInvitation';
import { Member } from '../../types/organization';

export async function acceptInvitation(
  token: string, 
  userId: string
): Promise<Member | null> {
  try {
    console.log('[acceptInvitation] Iniciando aceitação de convite com token:', token);
    
    // Buscar o convite
    const invitation = await getInvitationByToken(token);
    if (!invitation) {
      console.error('[acceptInvitation] Convite inválido ou expirado');
      throw new Error('Convite inválido ou expirado');
    }
    
    console.log('[acceptInvitation] Convite encontrado:', invitation);

    // Verificar se o usuário já é membro
    const { data: existingMember, error: checkError } = await supabase
      .from('organization_members')
      .select('*')
      .eq('organization_id', invitation.organization_id)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (checkError) {
      console.error('[acceptInvitation] Erro ao verificar se o usuário já é membro:', checkError);
    }
    
    if (existingMember) {
      console.log('[acceptInvitation] Usuário já é membro desta organização');
      
      // Marcar o convite como utilizado
      const { error: updateError } = await supabase
        .from('member_invitations')
        .update({ used_at: new Date().toISOString() })
        .eq('id', invitation.id);
        
      if (updateError) {
        console.error('[acceptInvitation] Erro ao atualizar convite existente:', updateError);
      }
      
      return existingMember;
    }

    // Iniciar uma transação para adicionar membro
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
      console.error('[acceptInvitation] Erro ao adicionar membro:', memberError);
      throw memberError;
    }
    
    console.log('[acceptInvitation] Membro adicionado com sucesso:', memberData);

    // Marcar o convite como utilizado
    const { error: updateError } = await supabase
      .from('member_invitations')
      .update({ used_at: new Date().toISOString() })
      .eq('id', invitation.id);

    if (updateError) {
      console.error('[acceptInvitation] Erro ao atualizar convite:', updateError);
      // Mesmo com erro ao atualizar convite, o membro foi adicionado
      // Então retornamos sucesso, mas logamos o erro
    }
    
    console.log('[acceptInvitation] Convite aceito e marcado como utilizado');

    return memberData;
  } catch (error) {
    console.error('[acceptInvitation] Erro ao aceitar convite:', error);
    return null;
  }
}
