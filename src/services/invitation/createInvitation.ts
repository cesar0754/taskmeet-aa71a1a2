import { supabase } from '@/lib/supabase';
import { Invitation } from '@/types/invitation';
import { v4 as uuidv4 } from 'uuid';

export async function createInvitation(
  organizationId: string,
  email: string,
  name: string,
  role: string = 'member'
): Promise<Invitation> {
  try {
    // Gerar token único para o convite
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expira em 7 dias

    // Criar o convite na tabela organization_members como pendente
    const { data: insertData, error: insertError } = await supabase
      .from('organization_members')
      .insert([
        {
          organization_id: organizationId,
          email,
          name,
          role,
          user_id: null // Será preenchido quando o usuário aceitar
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Erro ao criar convite:', insertError);
      throw insertError;
    }

    // Retornar um objeto Invitation compatível
    return {
      id: insertData.id,
      organization_id: organizationId,
      email,
      name,
      role,
      token,
      expires_at: expiresAt.toISOString(),
      invited_by: 'system', // Valor padrão
      used_at: null,
      created_at: insertData.created_at,
    };
  } catch (error) {
    console.error('Erro ao criar convite:', error);
    throw error;
  }
}