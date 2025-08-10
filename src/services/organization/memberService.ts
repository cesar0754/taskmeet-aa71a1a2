
import { supabase } from '@/integrations/supabase/client';
import { Member } from '../../types/organization';


/**
 * Adiciona um novo membro à organização
 */
export async function addNewMember(
  organizationId: string, 
  email: string, 
  name: string, 
  role: 'admin' | 'editor' | 'viewer'
): Promise<Member> {
  try {
    console.log('Adicionando novo membro:', { organizationId, email, name, role });
    
    const { data, error } = await (supabase as any)
      .from('organization_members')
      .insert([
        { 
          organization_id: organizationId, 
          email, 
          name, 
          role,
          user_id: null // Inicialmente null, será atualizado quando o usuário aceitar o convite
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar membro:', error);
      throw error;
    }

    console.log('Membro adicionado com sucesso:', data);
    
    // TODO: Enviar e-mail de convite para o membro com um link temporário
    // Será implementado em uma futura iteração
    
    return data;
  } catch (error) {
    console.error('Erro completo ao adicionar membro:', error);
    throw error;
  }
}

/**
 * Atualiza informações de um membro existente
 */
export async function updateExistingMember(id: string, data: Partial<Member>): Promise<void> {
  try {
    console.log('Atualizando membro:', { id, data });
    
    const { error } = await (supabase as any)
      .from('organization_members')
      .update(data)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar membro:', error);
      throw error;
    }
    
    console.log('Membro atualizado com sucesso');
  } catch (error) {
    console.error('Erro completo ao atualizar membro:', error);
    throw error;
  }
}

/**
 * Remove um membro existente da organização
 */
export async function removeExistingMember(id: string): Promise<boolean> {
  try {
    console.log('Removendo membro:', id);
    
    // Verifica se o membro existe antes de tentar remover
    const { data: memberData, error: memberError } = await (supabase as any)
      .from('organization_members')
      .select('*')
      .eq('id', id)
      .single();
      
    if (memberError) {
      console.error('Erro ao verificar membro:', memberError);
      return false;
    }
    
    if (!memberData) {
      console.error('Membro não encontrado com o ID:', id);
      return false;
    }
    
    // Executa a operação de exclusão
    const { error } = await (supabase as any)
      .from('organization_members')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao remover membro:', error);
      return false;
    }
    
    console.log('Membro removido com sucesso');
    return true;
  } catch (error) {
    console.error('Erro completo ao remover membro:', error);
    return false;
  }
}
