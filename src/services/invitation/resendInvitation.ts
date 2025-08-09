import { supabase } from '@/lib/supabase';
import { Invitation } from '@/types/invitation';
import { sendInvitationEmail } from '@/services/emailService';

export async function resendInvitation(invitationId: string): Promise<boolean> {
  try {
    // Buscar o convite existente
    const { data: memberData, error: fetchError } = await supabase
      .from('organization_members')
      .select('*')
      .eq('id', invitationId)
      .is('user_id', null)
      .maybeSingle();

    if (fetchError || !memberData) {
      console.error('Convite não encontrado:', fetchError);
      return false;
    }

    // Atualizar data de modificação
    const { data: updatedData, error: updateError } = await supabase
      .from('organization_members')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', invitationId)
      .select()
      .single();

    if (updateError) {
      console.error('Erro ao atualizar convite:', updateError);
      return false;
    }

    // Enviar e-mail de convite novamente via Edge Function (Resend)
    const { data: orgData } = await supabase
      .from('organizations')
      .select('name')
      .eq('id', updatedData.organization_id)
      .single();

    const baseUrl = window.location.origin;
    const inviteLink = `${baseUrl}/accept-invite?token=${encodeURIComponent(updatedData.email)}`;

    const emailSent = await sendInvitationEmail(
      updatedData.email,
      updatedData.name,
      orgData?.name || 'Organização',
      inviteLink,
      updatedData.role
    );

    if (!emailSent) {
      console.warn('[resendInvitation] Falha ao reenviar e-mail (Edge Function deve ter retornado erro).');
    }

    return emailSent;
  } catch (error) {
    console.error('Erro ao reenviar convite:', error);
    return false;
  }
}