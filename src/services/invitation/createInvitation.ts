import { supabase } from '@/lib/supabase';
import { Invitation } from '@/types/invitation';
import { sendInvitationEmail } from '@/services/emailService';

export async function createInvitation(
  organizationId: string,
  email: string,
  name: string,
  role: 'admin' | 'editor' | 'viewer' = 'viewer'
): Promise<{ invitation: Invitation; emailSent: boolean }> {
  try {
    // Verificar se já existe convite pendente para este email na organização
    const { data: existingInvite } = await supabase
      .from('organization_members')
      .select('id')
      .eq('organization_id', organizationId)
      .eq('email', email)
      .is('user_id', null)
      .single();

    if (existingInvite) {
      throw new Error('Já existe um convite pendente para este email nesta organização');
    }

    // Buscar nome da organização
    const { data: organization } = await supabase
      .from('organizations')
      .select('name')
      .eq('id', organizationId)
      .single();

    const normalizedRole: 'admin' | 'editor' | 'viewer' = (['admin','editor','viewer'] as const).includes(role as any)
      ? role
      : 'viewer';

    // Criar entrada na tabela organization_members (convite pendente)
    const { data: member, error } = await supabase
      .from('organization_members')
      .insert([{ 
        organization_id: organizationId,
        email,
        name,
        role: normalizedRole,
        user_id: null // Pendente
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar convite:', error);
      throw error;
    }

    // Gerar link de convite
    const baseUrl = window.location.origin;
    const inviteLink = `${baseUrl}/accept-invite?token=${encodeURIComponent(email)}`;

    // Enviar email de convite
    const emailSent = await sendInvitationEmail(
      email,
      name,
      organization?.name || 'Organização',
      inviteLink,
      normalizedRole
    );

    if (!emailSent) {
      console.warn('Falha ao enviar email de convite, mas convite foi criado');
    }

// Retornar resultado com status do envio de email
    const invitation: Invitation = {
      id: member.id,
      organization_id: organizationId,
      email,
      name,
      role: normalizedRole,
      token: email, // Usando email como token
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      invited_by: 'system',
      used_at: null,
      created_at: member.created_at,
    };

    return { invitation, emailSent };
  } catch (error) {
    console.error('Erro ao criar convite:', error);
    throw error;
  }
}