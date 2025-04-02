
import { supabase } from '../../lib/supabase';
import { Member } from '../../types/organization';

/**
 * Verifica se um usuário já é membro de uma organização
 * @param organizationId ID da organização
 * @param userId ID do usuário
 * @returns O membro encontrado ou null se não for membro
 */
export async function checkExistingMember(
  organizationId: string, 
  userId: string
): Promise<Member | null> {
  try {
    console.log('[checkExistingMember] Verificando se o usuário já é membro desta organização');
    
    const { data: existingMember, error } = await supabase
      .from('organization_members')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (error) {
      console.error('[checkExistingMember] Erro ao verificar membro existente:', error);
      return null;
    }
    
    return existingMember;
  } catch (error) {
    console.error('[checkExistingMember] Erro ao verificar membro existente:', error);
    return null;
  }
}
