
import { getInvitationByToken } from './getInvitation';
import { updateUserPassword } from './userPasswordService';
import { checkExistingMember } from './memberCheckService';
import { addOrganizationMember } from './addMemberService';
import { markInvitationAsUsed } from './updateInvitationService';
import { Member } from '../../types/organization';
import { supabase } from '../../lib/supabase';

/**
 * Processo completo de aceitação de um convite
 * @param token Token do convite
 * @param userId ID do usuário aceitando o convite
 * @param password Senha opcional a ser definida (para novos usuários)
 * @param skipEmailCheck Se verdadeiro, pula a verificação de correspondência de email
 * @returns O membro adicionado ou null em caso de erro
 */
export async function acceptInvitation(
  token: string, 
  userId: string,
  password?: string,
  skipEmailCheck: boolean = false
): Promise<Member | null> {
  try {
    console.log('[acceptInvitation] Iniciando aceitação de convite com token:', token);
    console.log('[acceptInvitation] ID do usuário:', userId);
    console.log('[acceptInvitation] Pular verificação de email:', skipEmailCheck);
    
    // Verificar se o usuário existe
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.error('[acceptInvitation] Usuário não encontrado:', userError);
      throw new Error('Usuário não encontrado');
    }
    
    console.log('[acceptInvitation] Email do usuário:', userData.user.email);
    
    // Buscar o convite
    const invitation = await getInvitationByToken(token);
    if (!invitation) {
      console.error('[acceptInvitation] Convite inválido ou expirado');
      throw new Error('Convite inválido ou expirado');
    }
    
    console.log('[acceptInvitation] Convite encontrado:', invitation);
    console.log('[acceptInvitation] Email do convite:', invitation.email);
    
    // Verificar se os emails coincidem apenas se skipEmailCheck for falso
    if (!skipEmailCheck && userData.user.email && invitation.email && 
        userData.user.email.toLowerCase() !== invitation.email.toLowerCase()) {
      console.error('[acceptInvitation] O email do usuário não coincide com o email do convite', {
        userEmail: userData.user.email,
        invitationEmail: invitation.email
      });
      throw new Error('Este convite foi enviado para outro endereço de email');
    }

    // Se o usuário forneceu uma senha, defina-a
    if (password) {
      console.log('[acceptInvitation] Definindo nova senha para o usuário');
      const passwordResult = await updateUserPassword(password);
      if (!passwordResult.success) {
        console.error('[acceptInvitation] Erro ao definir senha:', passwordResult.error);
        throw passwordResult.error || new Error('Erro ao definir senha');
      }
      console.log('[acceptInvitation] Senha definida com sucesso');
    }

    // Verificar se o usuário já é membro
    const existingMember = await checkExistingMember(invitation.organization_id, userId);
    
    if (existingMember) {
      console.log('[acceptInvitation] Usuário já é membro desta organização:', existingMember);
      
      // Marcar o convite como utilizado
      await markInvitationAsUsed(invitation.id);
      
      return existingMember;
    }

    // Adicionar novo membro
    console.log('[acceptInvitation] Adicionando novo membro à organização');
    const memberData = await addOrganizationMember(invitation, userId);
    if (!memberData) {
      console.error('[acceptInvitation] Erro ao adicionar membro à organização');
      throw new Error('Erro ao adicionar membro');
    }
    
    // Marcar o convite como utilizado
    await markInvitationAsUsed(invitation.id);
    
    console.log('[acceptInvitation] Convite aceito com sucesso, membro adicionado:', memberData);

    return memberData;
  } catch (error) {
    console.error('[acceptInvitation] Erro ao aceitar convite:', error);
    return null;
  }
}
