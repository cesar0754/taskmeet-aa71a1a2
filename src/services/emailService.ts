
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
      console.error('Erro ao invocar função de envio de e-mail:', error);
      return false;
    }

    console.log('Resposta do serviço de e-mail:', data);
    return true;
  } catch (error) {
    console.error('Erro completo ao enviar e-mail de convite:', error);
    return false;
  }
}
