
import { supabase } from '../../lib/supabase';
import { Invitation } from '../../types/invitation';

export async function getInvitationByToken(token: string): Promise<Invitation | null> {
  try {
    const { data, error } = await supabase
      .from('member_invitations')
      .select('*')
      .eq('token', token)
      .is('used_at', null)
      .single();

    if (error) {
      console.error('Erro ao buscar convite:', error);
      return null;
    }

    // Verificar se o convite expirou
    const expiresAt = new Date(data.expires_at);
    if (expiresAt < new Date()) {
      console.error('Convite expirado');
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar convite por token:', error);
    return null;
  }
}

export async function getInvitationsByOrganization(organizationId: string): Promise<Invitation[]> {
  try {
    console.log('[getInvitationsByOrganization] Buscando convites para organização:', organizationId);
    
    const { data, error } = await supabase
      .from('member_invitations')
      .select('*')
      .eq('organization_id', organizationId)
      .is('used_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[getInvitationsByOrganization] Erro ao buscar convites da organização:', error);
      throw error;
    }

    console.log('[getInvitationsByOrganization] Total de convites encontrados:', data?.length || 0);
    console.log('[getInvitationsByOrganization] Convites:', data);
    
    return data || [];
  } catch (error) {
    console.error('[getInvitationsByOrganization] Erro completo ao buscar convites:', error);
    return [];
  }
}
