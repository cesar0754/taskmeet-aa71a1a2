
import { supabase } from '@/integrations/supabase/client';
import { Organization, Member } from '../../types/organization';

/**
 * Busca as organizações de um usuário específico
 */
export async function fetchUserOrganizations(userId: string): Promise<Organization | null> {
  try {
    console.log("Buscando organizações para o usuário:", userId);

    // 1) Tentar localizar organização via membresia (usuário convidado)
    const { data: membership, error: membershipError } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (membershipError) {
      console.warn('Erro ao verificar membresia do usuário:', membershipError);
    }

    if (membership?.organization_id) {
      const { data: orgFromMembership, error: orgFromMembershipError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', membership.organization_id)
        .maybeSingle();

      if (orgFromMembershipError) {
        console.error('Erro ao buscar organização pela membresia:', orgFromMembershipError);
      } else if (orgFromMembership) {
        console.log("Organização (via membresia) encontrada:", orgFromMembership);
        return orgFromMembership;
      }
    }

    // 2) Fallback: organização onde o usuário é o proprietário (owner)
    const { data: ownerOrg, error: ownerError } = await supabase
      .from('organizations')
      .select('*')
      .eq('owner_id', userId)
      .maybeSingle();

    if (ownerError) {
      console.error('Erro ao buscar organização do usuário (owner):', ownerError);
      throw ownerError;
    }

    console.log("Organização (via owner) encontrada:", ownerOrg);
    return ownerOrg || null;
  } catch (error) {
    console.error('Erro completo ao buscar organizações:', error);
    throw error;
  }
}

/**
 * Busca uma organização específica por ID
 */
export async function fetchOrganizationById(organizationId: string): Promise<Organization | null> {
  try {
    console.log("Buscando organização por ID:", organizationId);
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar organização por ID:', error);
      throw error;
    }

    console.log("Organização encontrada:", data);
    return data;
  } catch (error) {
    console.error('Erro completo ao buscar organização por ID:', error);
    throw error;
  }
}

/**
 * Cria uma nova organização para um usuário
 */
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

/**
 * Atualiza informações de uma organização existente
 */
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

/**
 * Busca membros de uma organização específica
 */
export async function fetchOrganizationMembers(organizationId: string): Promise<Member[]> {
  try {
    console.log("Buscando membros para a organização:", organizationId);
  const { data, error } = await supabase
      .from('organization_members')
      .select('*')
      .eq('organization_id', organizationId)
      .not('user_id', 'is', null);

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
