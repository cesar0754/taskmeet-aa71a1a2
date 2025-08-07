import { supabase } from '@/lib/supabase';
import { Invitation } from '@/types/invitation';

export async function getInvitationByToken(token: string): Promise<Invitation | null> {
  try {
    // Buscar em organization_members pendentes usando email como token
    const { data: memberData, error: memberError } = await supabase
      .from('organization_members')
      .select('*')
      .eq('email', token) // Usar email como token
      .is('user_id', null)
      .maybeSingle();

    if (memberError || !memberData) {
      return null;
    }

    // Converter para formato Invitation
    return {
      id: memberData.id,
      organization_id: memberData.organization_id,
      email: memberData.email,
      name: memberData.name,
      role: memberData.role,
      token: token,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      invited_by: 'system',
      used_at: null,
      created_at: memberData.created_at,
    };
  } catch (error) {
    console.error('Erro ao buscar convite:', error);
    return null;
  }
}

export async function getInvitationsByOrganization(organizationId: string): Promise<Invitation[]> {
  try {
    // Buscar membros pendentes (sem user_id)
    const { data: memberData, error: memberError } = await supabase
      .from('organization_members')
      .select('*')
      .eq('organization_id', organizationId)
      .is('user_id', null);

    if (memberError) {
      console.error('Erro ao buscar convites:', memberError);
      return [];
    }

    // Converter para formato Invitation
    return (memberData || []).map(member => ({
      id: member.id,
      organization_id: member.organization_id,
      email: member.email,
      name: member.name,
      role: member.role,
      token: member.email, // Usar email como token
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      invited_by: 'system',
      used_at: null,
      created_at: member.created_at,
    }));
  } catch (error) {
    console.error('Erro ao buscar convites:', error);
    return [];
  }
}