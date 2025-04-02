
import { getInvitationByToken } from './getInvitation';
import { updateUserPassword } from './userPasswordService';
import { checkExistingMember } from './memberCheckService';
import { addOrganizationMember } from './addMemberService';
import { markInvitationAsUsed } from './updateInvitationService';
import { Member } from '../../types/organization';

/**
 * Processo completo de aceitação de um convite
 * @param token Token do convite
 * @param userId ID do usuário aceitando o convite
 * @param password Senha opcional a ser definida (para novos usuários)
 * @returns O membro adicionado ou null em caso de erro
 */
export async function acceptInvitation(
  token: string, 
  userId: string,
  password?: string
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

    // Se o usuário forneceu uma senha, defina-a
    if (password) {
      const passwordResult = await updateUserPassword(password);
      if (!passwordResult.success) {
        throw passwordResult.error || new Error('Erro ao definir senha');
      }
    }

    // Verificar se o usuário já é membro
    const existingMember = await checkExistingMember(invitation.organization_id, userId);
    
    if (existingMember) {
      console.log('[acceptInvitation] Usuário já é membro desta organização');
      
      // Marcar o convite como utilizado
      await markInvitationAsUsed(invitation.id);
      
      return existingMember;
    }

    // Adicionar novo membro
    const memberData = await addOrganizationMember(invitation, userId);
    if (!memberData) {
      throw new Error('Erro ao adicionar membro');
    }
    
    // Marcar o convite como utilizado
    await markInvitationAsUsed(invitation.id);
    
    console.log('[acceptInvitation] Convite aceito com sucesso');

    return memberData;
  } catch (error) {
    console.error('[acceptInvitation] Erro ao aceitar convite:', error);
    return null;
  }
}
