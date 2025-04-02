
import { supabase } from '../../lib/supabase';

export async function deleteInvitation(id: string): Promise<boolean> {
  try {
    console.log('Iniciando processo de remoção do convite com ID:', id);
    
    // Verifique se o convite existe antes de tentar removê-lo
    const { data: invitationData, error: checkError } = await supabase
      .from('member_invitations')
      .select('id')
      .eq('id', id)
      .single();
      
    if (checkError || !invitationData) {
      console.error('Erro ao verificar convite ou convite não encontrado:', checkError);
      return false;
    }
    
    // Executa a exclusão
    const { error } = await supabase
      .from('member_invitations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir convite:', error);
      return false;
    }
    
    console.log('Convite removido com sucesso do banco de dados');
    return true;
  } catch (error) {
    console.error('Erro completo ao excluir convite:', error);
    return false;
  }
}
