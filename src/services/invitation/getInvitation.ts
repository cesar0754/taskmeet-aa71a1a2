
import { supabase } from '../../lib/supabase';
import { Invitation } from '../../types/invitation';

export async function getInvitationByToken(token: string): Promise<Invitation | null> {
  try {
    console.log('[getInvitationByToken] Iniciando busca por token:', token);
    
    // Verificar se o token está em formato válido
    if (!token || token.trim() === '') {
      console.error('[getInvitationByToken] Token inválido ou vazio:', token);
      return null;
    }
    
    const { data, error } = await supabase
      .from('member_invitations')
      .select('*')
      .eq('token', token)
      .is('used_at', null);
      
    if (error) {
      console.error('[getInvitationByToken] Erro do Supabase ao buscar convite:', error);
      return null;
    }
    
    console.log('[getInvitationByToken] Resultados encontrados:', data?.length);
    
    if (!data || data.length === 0) {
      console.log('[getInvitationByToken] Nenhum convite encontrado com o token fornecido');
      return null;
    }
    
    // Pegar o primeiro convite (deveria ser único pelo token)
    const invitation = data[0];
    
    // Verificar se o convite expirou
    const expiresAt = new Date(invitation.expires_at);
    if (expiresAt < new Date()) {
      console.error('[getInvitationByToken] Convite expirado. Expiração:', expiresAt, 'Agora:', new Date());
      return null;
    }

    console.log('[getInvitationByToken] Convite válido encontrado:', invitation);
    return invitation;
  } catch (error) {
    console.error('[getInvitationByToken] Erro ao buscar convite por token:', error);
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
