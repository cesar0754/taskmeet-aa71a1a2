
import { supabase } from '../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { Invitation } from '../../types/invitation';

export async function createInvitation(
  organizationId: string,
  email: string,
  name: string,
  role: string
): Promise<Invitation | null> {
  try {
    console.log('Criando convite para:', { organizationId, email, name, role });
    
    // Verificar se o usuário atual está autenticado
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('Usuário não autenticado');
    }
    
    // Gerar token único para o convite
    const token = uuidv4();
    
    // Inserir o convite no banco de dados
    const { data, error } = await supabase
      .from('member_invitations')
      .insert([
        { 
          organization_id: organizationId, 
          email, 
          name, 
          role,
          token,
          invited_by: userData.user.id
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar convite:', error);
      throw error;
    }

    console.log('Convite criado com sucesso:', data);
    
    // Buscar o nome da organização
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .select('name')
      .eq('id', organizationId)
      .single();
    
    if (orgError) {
      console.error('Erro ao buscar organização:', orgError);
    }
    
    const organizationName = orgData?.name || 'TaskMeet';
    
    // Preparar o link do convite
    const baseUrl = window.location.origin;
    const inviteLink = `${baseUrl}/accept-invite?token=${token}`;
    
    // Enviar e-mail usando o serviço nativo do Supabase
    const { error: emailError } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: {
        name,
        organization_id: organizationId,
        role,
        token,
        custom_invite_url: inviteLink,
        organization_name: organizationName,
      }
    });
    
    if (emailError) {
      console.error('Erro ao enviar e-mail de convite:', emailError);
      // Se falhar, não lançamos erro, pois o convite já foi criado
      // Podemos implementar futuramente um sistema de reenvio
    }
    
    return data;
  } catch (error) {
    console.error('Erro completo ao criar convite:', error);
    throw error;
  }
}
