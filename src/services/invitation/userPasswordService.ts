
import { supabase } from '../../lib/supabase';

/**
 * Define ou atualiza a senha de um usuário
 * @param password Nova senha para o usuário
 * @returns Um objeto com status de sucesso e possível erro
 */
export async function updateUserPassword(password: string): Promise<{ success: boolean; error?: Error }> {
  try {
    console.log('[updateUserPassword] Definindo senha para o usuário');
    
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error('[updateUserPassword] Erro ao obter usuário atual:', userError);
      return { success: false, error: new Error('Erro ao obter usuário atual') };
    }
    
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      console.error('[updateUserPassword] Erro ao definir senha:', error);
      return { success: false, error: new Error('Erro ao definir senha') };
    }
    
    console.log('[updateUserPassword] Senha definida com sucesso');
    
    // Após atualizar a senha, marcamos o usuário como não sendo mais seu primeiro login
    const { error: updateError } = await supabase
      .from('organization_members')
      .update({ is_first_login: false })
      .eq('user_id', userData.user.id);
      
    if (updateError) {
      console.error('[updateUserPassword] Erro ao atualizar status de primeiro login:', updateError);
      // Não falharemos aqui, já que a senha foi atualizada com sucesso
    }
    
    return { success: true };
  } catch (error) {
    console.error('[updateUserPassword] Erro ao definir senha:', error);
    return { success: false, error: error instanceof Error ? error : new Error('Erro desconhecido ao definir senha') };
  }
}
