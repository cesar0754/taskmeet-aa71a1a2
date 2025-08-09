
import { supabase } from '../lib/supabase';

export async function sendInvitationEmail(
  email: string, 
  name: string, 
  organization: string, 
  inviteLink: string,
  role: string
): Promise<boolean> {
  try {
    console.log('Enviando e-mail de convite para:', email);
    
    const { data, error } = await supabase.functions.invoke('send-invitation-email', {
      body: {
        email,
        name,
        organization,
        inviteLink,
        role
      }
    });

    if (error) {
      console.error('Erro ao invocar Edge Function de envio de e-mail:', error);
      return false;
    }

    const success = (data as any)?.success === true && !(data as any)?.error;
    console.log('Resposta da Edge Function de e-mail:', data);
    return !!success;
  } catch (error) {
    console.error('Erro completo ao enviar e-mail de convite:', error);
    return false;
  }
}
