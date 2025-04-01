
import { supabase } from '../lib/supabase';
import { Organization, Member } from '../types/organization';

export async function fetchUserOrganizations(userId: string): Promise<Organization | null> {
  try {
    // Verificamos se o usuário é proprietário de alguma organização
    const { data: ownedOrgs, error: ownedOrgsError } = await supabase
      .from('organizations')
      .select('*')
      .eq('owner_id', userId);

    if (ownedOrgsError) throw ownedOrgsError;

    // Verificamos se é membro de alguma organização
    const { data: memberOrgs, error: memberOrgsError } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', userId);

    if (memberOrgsError) throw memberOrgsError;

    let selectedOrg = null;

    // Prioridade para organizações que o usuário é dono
    if (ownedOrgs && ownedOrgs.length > 0) {
      selectedOrg = ownedOrgs[0];
    } 
    // Se não for dono de nenhuma, mas for membro de alguma
    else if (memberOrgs && memberOrgs.length > 0) {
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', memberOrgs[0].organization_id)
        .single();

      if (orgError) throw orgError;
      selectedOrg = org;
    }

    return selectedOrg;
  } catch (error) {
    console.error('Error fetching user organizations:', error);
    throw error;
  }
}

export async function fetchOrganizationMembers(organizationId: string): Promise<Member[]> {
  try {
    const { data, error } = await supabase
      .from('organization_members')
      .select('*')
      .eq('organization_id', organizationId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching organization members:', error);
    throw error;
  }
}

export async function createNewOrganization(name: string, userId: string): Promise<Organization | null> {
  try {
    // 1. Criar a organização
    const { data: newOrg, error: orgError } = await supabase
      .from('organizations')
      .insert([
        { name, owner_id: userId }
      ])
      .select()
      .single();

    if (orgError) throw orgError;

    // 2. Adicionar o usuário criador como membro administrador
    const { data: userData } = await supabase.auth.getUser();
    const userName = userData.user?.user_metadata?.name || userData.user?.email?.split('@')[0] || 'Admin';
    const userEmail = userData.user?.email || '';
    
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert([
        { 
          organization_id: newOrg.id, 
          user_id: userId, 
          role: 'admin',
          name: userName,
          email: userEmail
        }
      ]);

    if (memberError) throw memberError;

    return newOrg;
  } catch (error) {
    console.error('Error creating organization:', error);
    throw error;
  }
}

export async function updateExistingOrganization(id: string, data: Partial<Organization>): Promise<void> {
  try {
    const { error } = await supabase
      .from('organizations')
      .update(data)
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating organization:', error);
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
    // Para membros convidados que ainda não têm conta, usamos 'pending' como user_id temporário
    const userId = 'pending';

    const { data, error } = await supabase
      .from('organization_members')
      .insert([
        { 
          organization_id: organizationId, 
          user_id: userId, 
          role,
          name,
          email
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding member:', error);
    throw error;
  }
}

export async function updateExistingMember(id: string, data: Partial<Member>): Promise<void> {
  try {
    const { error } = await supabase
      .from('organization_members')
      .update(data)
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating member:', error);
    throw error;
  }
}

export async function removeExistingMember(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('organization_members')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error removing member:', error);
    throw error;
  }
}
