
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
      .is('used_at', null)
      .single();
    
    if (fetchError || !invitation) {
      console.error('[resendInvitation] Erro ao buscar convite:', fetchError);
      return false;
    }
    
    console.log('[resendInvitation] Dados do convite encontrados:', invitation);
    
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
    console.log('[resendInvitation] Nome da organização:', organizationName);
    
    // Preparar e reenviar o e-mail de convite
    const baseUrl = window.location.origin;
    const inviteLink = `${baseUrl}/accept-invite?token=${invitation.token}`;
    
    console.log('[resendInvitation] Link do convite:', inviteLink);
    
    const emailSent = await sendInvitationEmail(
      invitation.email,
      invitation.name,
      organizationName,
      inviteLink,
      invitation.role
    );
    
    console.log('[resendInvitation] Resultado do envio de e-mail:', emailSent ? 'Sucesso' : 'Falha');
    
    if (emailSent) {
      // Atualizar a data de expiração do convite (7 dias a partir de agora)
      const newExpiryDate = new Date();
      newExpiryDate.setDate(newExpiryDate.getDate() + 7);
      
      const { error: updateError } = await supabase
        .from('member_invitations')
        .update({ 
          expires_at: newExpiryDate.toISOString() 
        })
        .eq('id', invitationId);
      
      if (updateError) {
        console.error('[resendInvitation] Erro ao atualizar data de expiração:', updateError);
        // Mesmo com erro na atualização, o e-mail foi enviado
      } else {
        console.log('[resendInvitation] Data de expiração atualizada para:', newExpiryDate.toISOString());
      }
    }
    
    return emailSent;
  } catch (error) {
    console.error('[resendInvitation] Erro completo ao reenviar convite:', error);
    return false;
  }
}
