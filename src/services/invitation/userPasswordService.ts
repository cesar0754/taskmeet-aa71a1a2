
import { supabase } from '../../lib/supabase';

/**
 * Define ou atualiza a senha de um usuário
 * @param password Nova senha para o usuário
 * @returns Um objeto com status de sucesso e possível erro
 */
export async function updateUserPassword(password: string): Promise<{ success: boolean; error?: Error }> {
  try {
    console.log('[updateUserPassword] Definindo senha para o usuário');
    
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      console.error('[updateUserPassword] Erro ao definir senha:', error);
      return { success: false, error: new Error('Erro ao definir senha') };
    }
    
    console.log('[updateUserPassword] Senha definida com sucesso');
    return { success: true };
  } catch (error) {
    console.error('[updateUserPassword] Erro ao definir senha:', error);
    return { success: false, error: error instanceof Error ? error : new Error('Erro desconhecido ao definir senha') };
  }
}
