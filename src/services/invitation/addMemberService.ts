
import { supabase } from '../../lib/supabase';
import { Member } from '../../types/organization';
import { Invitation } from '../../types/invitation';
import { notificationService } from '../notificationService';

/**
 * Adiciona um usuário como membro de uma organização
 * @param invitation Dados do convite
 * @param userId ID do usuário a ser adicionado
 * @returns O membro adicionado ou null em caso de erro
 */
export async function addOrganizationMember(
  invitation: Invitation,
  userId: string
): Promise<Member | null> {
  try {
    console.log('[addOrganizationMember] Adicionando usuário como membro da organização');
    
    const { data: memberData, error } = await supabase
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

    if (error) {
      console.error('[addOrganizationMember] Erro ao adicionar membro:', error);
      throw error;
    }
    
    console.log('[addOrganizationMember] Membro adicionado com sucesso:', memberData);

    // Criar notificação de boas-vindas para o novo membro
    try {
      await notificationService.createNotification({
        user_id: userId,
        organization_id: invitation.organization_id,
        title: 'Bem-vindo à organização!',
        message: `Você foi adicionado com sucesso à organização como ${invitation.role}.`,
        type: 'success',
        action_url: '/dashboard'
      });
    } catch (notificationError) {
      console.error('[addOrganizationMember] Erro ao criar notificação de boas-vindas:', notificationError);
    }

    return memberData;
  } catch (error) {
    console.error('[addOrganizationMember] Erro ao adicionar membro:', error);
    return null;
  }
}
