
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
    
    // Primeiro verifica se o usuário já é membro com user_id preenchido
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
    
    if (existingMember) {
      console.log('[checkExistingMember] Membro existente encontrado com user_id:', existingMember);
      return existingMember;
    }
    
    // Se não encontrou por user_id, pode ser que o membro esteja na fase de convite
    // Busca o email do usuário atual para verificar
    const { data: userData } = await supabase.auth.getUser();
    const userEmail = userData.user?.email;
    
    if (!userEmail) {
      console.log('[checkExistingMember] Usuário atual não tem email, não é possível verificar convite pendente');
      return null;
    }
    
    console.log('[checkExistingMember] Verificando membro por email:', userEmail);
    
    // Busca membro pelo email
    const { data: pendingMember, error: pendingError } = await supabase
      .from('organization_members')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('email', userEmail)
      .maybeSingle();
      
    if (pendingError) {
      console.error('[checkExistingMember] Erro ao verificar membro pendente:', pendingError);
      return null;
    }
    
    if (pendingMember) {
      console.log('[checkExistingMember] Membro pendente encontrado por email:', pendingMember);
      
      // Atualiza o user_id do membro pendente se ainda não estiver definido
      if (!pendingMember.user_id || pendingMember.user_id !== userId) {
        console.log('[checkExistingMember] Atualizando user_id do membro pendente');
        
        const { error: updateError } = await supabase
          .from('organization_members')
          .update({ user_id: userId })
          .eq('id', pendingMember.id);
          
        if (updateError) {
          console.error('[checkExistingMember] Erro ao atualizar user_id do membro pendente:', updateError);
        }
        
        // Retorna o membro com o user_id atualizado
        return { ...pendingMember, user_id: userId };
      }
      
      return pendingMember;
    }
    
    console.log('[checkExistingMember] Nenhum membro encontrado para este usuário');
    return null;
  } catch (error) {
    console.error('[checkExistingMember] Erro ao verificar membro existente:', error);
    return null;
  }
}
