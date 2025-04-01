
import { supabase } from '../lib/supabase';
import { Organization, Member } from '../types/organization';

export async function fetchUserOrganizations(userId: string): Promise<Organization | null> {
  try {
    console.log("Buscando organizações para o usuário:", userId);
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('owner_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar organizações do usuário:', error);
      throw error;
    }

    console.log("Organizações encontradas:", data);
    return data;
  } catch (error) {
    console.error('Erro completo ao buscar organizações:', error);
    throw error;
  }
}

export async function fetchOrganizationMembers(organizationId: string): Promise<Member[]> {
  try {
    console.log("Buscando membros para a organização:", organizationId);
    const { data, error } = await supabase
      .from('organization_members')
      .select('*')
      .eq('organization_id', organizationId);

    if (error) {
      console.error('Erro ao buscar membros da organização:', error);
      throw error;
    }

    console.log("Membros encontrados:", data);
    return data || [];
  } catch (error) {
    console.error('Erro completo ao buscar membros:', error);
    throw error;
  }
}

export async function createNewOrganization(name: string, userId: string): Promise<Organization | null> {
  try {
    console.log('Criando organização - Nome:', name);
    console.log('Criando organização - UserID:', userId);

    // 1. Criar a organização
    const { data: newOrg, error: orgError } = await supabase
      .from('organizations')
      .insert([
        { name, owner_id: userId }
      ])
      .select()
      .single();

    if (orgError) {
      console.error('Erro ao criar organização:', orgError);
      throw orgError;
    }

    console.log('Organização criada:', newOrg);

    // 2. Adicionar o usuário criador como membro administrador
    const { data: userData } = await supabase.auth.getUser();
    const userName = userData.user?.user_metadata?.name || userData.user?.email?.split('@')[0] || 'Admin';
    const userEmail = userData.user?.email || '';
    
    console.log('Dados do usuário para adicionar como membro:', { userName, userEmail });

    const { data: memberData, error: memberError } = await supabase
      .from('organization_members')
      .insert([
        { 
          organization_id: newOrg.id, 
          user_id: userId, 
          role: 'admin',
          name: userName,
          email: userEmail
        }
      ])
      .select();

    if (memberError) {
      console.error('Erro ao adicionar membro:', memberError);
      throw memberError;
    }

    console.log('Membro adicionado:', memberData);

    return newOrg;
  } catch (error) {
    console.error('Erro completo ao criar organização:', error);
    throw error;
  }
}

export async function updateExistingOrganization(id: string, data: Partial<Organization>): Promise<void> {
  try {
    const { error } = await supabase
      .from('organizations')
      .update(data)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar organização:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erro completo ao atualizar organização:', error);
    throw error;
  }
}

export async function addNewMember(
  organizationId: string, 
  email: string, 
  name: string, 
  role: string
): Promise<Member> {
  try {
    console.log('Adicionando novo membro:', { organizationId, email, name, role });
    
    const { data, error } = await supabase
      .from('organization_members')
      .insert([
        { 
          organization_id: organizationId, 
          email, 
          name, 
          role,
          user_id: null // Inicialmente null, será atualizado quando o usuário aceitar o convite
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar membro:', error);
      throw error;
    }

    console.log('Membro adicionado com sucesso:', data);
    
    // TODO: Enviar e-mail de convite para o membro com um link temporário
    // Será implementado em uma futura iteração
    
    return data;
  } catch (error) {
    console.error('Erro completo ao adicionar membro:', error);
    throw error;
  }
}

export async function updateExistingMember(id: string, data: Partial<Member>): Promise<void> {
  try {
    console.log('Atualizando membro:', { id, data });
    
    const { error } = await supabase
      .from('organization_members')
      .update(data)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar membro:', error);
      throw error;
    }
    
    console.log('Membro atualizado com sucesso');
  } catch (error) {
    console.error('Erro completo ao atualizar membro:', error);
    throw error;
  }
}

export async function removeExistingMember(id: string): Promise<void> {
  try {
    console.log('Removendo membro:', id);
    
    const { error } = await supabase
      .from('organization_members')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao remover membro:', error);
      throw error;
    }
    
    console.log('Membro removido com sucesso');
  } catch (error) {
    console.error('Erro completo ao remover membro:', error);
    throw error;
  }
}
