import { supabase } from '@/lib/supabase';
import { Invitation } from '@/types/invitation';
import { sendInvitationEmail } from '@/services/emailService';

export async function resendInvitation(invitationId: string): Promise<Invitation | null> {
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
      return null;
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
      return null;
    }

    // Enviar e-mail de convite novamente via Edge Function (Resend)
    try {
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
        console.warn('Falha ao reenviar e-mail de convite');
      }
    } catch (e) {
      console.error('Erro ao tentar reenviar e-mail de convite:', e);
    }

    // Retornar convite no formato esperado
    return {
      id: updatedData.id,
      organization_id: updatedData.organization_id,
      email: updatedData.email,
      name: updatedData.name,
      role: updatedData.role,
      token: updatedData.email, // Usar email como token
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      invited_by: 'system',
      used_at: null,
      created_at: updatedData.created_at,
    };
  } catch (error) {
    console.error('Erro ao reenviar convite:', error);
    return null;
  }
}