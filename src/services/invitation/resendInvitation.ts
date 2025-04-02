
import { supabase } from '../../lib/supabase';
import { Invitation } from '../../types/invitation';
import { sendInvitationEmail } from '../emailService';

export async function resendInvitation(invitationId: string): Promise<boolean> {
  try {
    console.log('[resendInvitation] Reenviando convite com ID:', invitationId);
    
    // Buscar os dados do convite
    const { data: invitation, error: fetchError } = await supabase
      .from('member_invitations')
      .select('*')
      .eq('id', invitationId)
      .single();
    
    if (fetchError || !invitation) {
      console.error('[resendInvitation] Erro ao buscar convite:', fetchError);
      return false;
    }
    
    // Buscar o nome da organização
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .select('name')
      .eq('id', invitation.organization_id)
      .single();
    
    if (orgError) {
      console.error('[resendInvitation] Erro ao buscar organização:', orgError);
      return false;
    }
    
    const organizationName = orgData?.name || 'TaskMeet';
    
    // Preparar e reenviar o e-mail de convite
    const baseUrl = window.location.origin;
    const inviteLink = `${baseUrl}/accept-invite?token=${invitation.token}`;
    
    const emailSent = await sendInvitationEmail(
      invitation.email,
      invitation.name,
      organizationName,
      inviteLink,
      invitation.role
    );
    
    return emailSent;
  } catch (error) {
    console.error('[resendInvitation] Erro ao reenviar convite:', error);
    return false;
  }
}
