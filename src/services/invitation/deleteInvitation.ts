import { supabase } from '@/lib/supabase';

export async function deleteInvitation(invitationId: string): Promise<boolean> {
  try {
    // Deletar de organization_members (apenas convites pendentes)
    const { error } = await supabase
      .from('organization_members')
      .delete()
      .eq('id', invitationId)
      .is('user_id', null); // Apenas convites pendentes

    if (error) {
      console.error('Erro ao deletar convite:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao deletar convite:', error);
    return false;
  }
}