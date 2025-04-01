
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { Member } from '../types/organization';
import { sendInvitationEmail } from './emailService';

export interface Invitation {
  id: string;
  organization_id: string;
  email: string;
  name: string;
  role: string;
  token: string;
  expires_at: string;
  invited_by: string;
  created_at: string;
  used_at: string | null;
}

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
    
    // Preparar e enviar o e-mail de convite
    const baseUrl = window.location.origin;
    const inviteLink = `${baseUrl}/accept-invite?token=${token}`;
    
    await sendInvitationEmail(
      email,
      name,
      organizationName,
      inviteLink,
      role
    );
    
    return data;
  } catch (error) {
    console.error('Erro completo ao criar convite:', error);
    throw error;
  }
}

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

export async function acceptInvitation(
  token: string, 
  userId: string
): Promise<Member | null> {
  try {
    // Buscar o convite
    const invitation = await getInvitationByToken(token);
    if (!invitation) {
      throw new Error('Convite inválido ou expirado');
    }

    // Iniciar uma transação
    const { data: memberData, error: memberError } = await supabase
      .from('organization_members')
      .insert([
        { 
          organization_id: invitation.organization_id, 
          user_id: userId,
          email: invitation.email,
          name: invitation.name,
          role: invitation.role,
          pending: false
        }
      ])
      .select()
      .single();

    if (memberError) {
      console.error('Erro ao adicionar membro:', memberError);
      throw memberError;
    }

    // Marcar o convite como utilizado
    const { error: updateError } = await supabase
      .from('member_invitations')
      .update({ used_at: new Date().toISOString() })
      .eq('id', invitation.id);

    if (updateError) {
      console.error('Erro ao atualizar convite:', updateError);
      throw updateError;
    }

    return memberData;
  } catch (error) {
    console.error('Erro ao aceitar convite:', error);
    return null;
  }
}

export async function getInvitationsByOrganization(organizationId: string): Promise<Invitation[]> {
  try {
    const { data, error } = await supabase
      .from('member_invitations')
      .select('*')
      .eq('organization_id', organizationId)
      .is('used_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar convites da organização:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erro completo ao buscar convites:', error);
    return [];
  }
}

export async function deleteInvitation(id: string): Promise<boolean> {
  try {
    console.log('Iniciando processo de remoção do convite com ID:', id);
    
    // Opção 1: Exclusão real (recomendada para convites)
    const { error } = await supabase
      .from('member_invitations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir convite:', error);
      throw error;
    }
    
    console.log('Convite removido com sucesso do banco de dados');
    return true;
  } catch (error) {
    console.error('Erro completo ao excluir convite:', error);
    throw error;
  }
}
