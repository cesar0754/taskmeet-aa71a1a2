import { supabase } from '@/integrations/supabase/client';
import { Group, GroupMember, CreateGroupData, UpdateGroupData, AddGroupMemberData } from '@/types/group';

/**
 * Buscar todos os grupos de uma organização
 */
export async function fetchGroups(organizationId: string): Promise<Group[]> {
  try {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar grupos:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erro completo ao buscar grupos:', error);
    throw error;
  }
}

/**
 * Buscar um grupo específico
 */
export async function fetchGroupById(groupId: string): Promise<Group | null> {
  try {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('id', groupId)
      .single();

    if (error) {
      console.error('Erro ao buscar grupo:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro completo ao buscar grupo:', error);
    throw error;
  }
}

/**
 * Criar um novo grupo
 */
export async function createGroup(groupData: CreateGroupData): Promise<Group> {
  try {
    const { data, error } = await supabase
      .from('groups')
      .insert([{
        ...groupData,
        created_by: (await supabase.auth.getUser()).data.user?.id
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar grupo:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro completo ao criar grupo:', error);
    throw error;
  }
}

/**
 * Atualizar um grupo existente
 */
export async function updateGroup(groupId: string, groupData: UpdateGroupData): Promise<Group> {
  try {
    const { data, error } = await supabase
      .from('groups')
      .update(groupData)
      .eq('id', groupId)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar grupo:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro completo ao atualizar grupo:', error);
    throw error;
  }
}

/**
 * Deletar um grupo
 */
export async function deleteGroup(groupId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', groupId);

    if (error) {
      console.error('Erro ao deletar grupo:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erro completo ao deletar grupo:', error);
    throw error;
  }
}

/**
 * Buscar membros de um grupo
 */
export async function fetchGroupMembers(groupId: string): Promise<GroupMember[]> {
  try {
    // Primeiro buscar os membros do grupo
    const { data: groupMembersData, error: groupMembersError } = await supabase
      .from('group_members')
      .select('*')
      .eq('group_id', groupId);

    if (groupMembersError) {
      console.error('Erro ao buscar membros do grupo:', groupMembersError);
      throw groupMembersError;
    }

    if (!groupMembersData || groupMembersData.length === 0) {
      return [];
    }

    // Buscar dados dos membros da organização
    const memberIds = groupMembersData.map(gm => gm.member_id);
    const { data: orgMembersData, error: orgMembersError } = await supabase
      .from('organization_members')
      .select('id, name, email, role')
      .in('id', memberIds);

    if (orgMembersError) {
      console.error('Erro ao buscar dados dos membros:', orgMembersError);
      throw orgMembersError;
    }

    // Combinar os dados
    const result = groupMembersData.map(groupMember => ({
      ...groupMember,
      member: orgMembersData?.find(orgMember => orgMember.id === groupMember.member_id)
    })).filter(item => item.member); // Filtrar apenas itens com dados do membro

    return result as GroupMember[];
  } catch (error) {
    console.error('Erro completo ao buscar membros do grupo:', error);
    throw error;
  }
}

/**
 * Adicionar membro ao grupo
 */
export async function addGroupMember(memberData: AddGroupMemberData): Promise<GroupMember> {
  try {
    const { data, error } = await supabase
      .from('group_members')
      .insert([memberData])
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar membro ao grupo:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro completo ao adicionar membro ao grupo:', error);
    throw error;
  }
}

/**
 * Remover membro do grupo
 */
export async function removeGroupMember(groupMemberId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('id', groupMemberId);

    if (error) {
      console.error('Erro ao remover membro do grupo:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erro completo ao remover membro do grupo:', error);
    throw error;
  }
}

/**
 * Atualizar role do membro no grupo
 */
export async function updateGroupMemberRole(groupMemberId: string, role: string): Promise<GroupMember> {
  try {
    const { data, error } = await supabase
      .from('group_members')
      .update({ role })
      .eq('id', groupMemberId)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar role do membro:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro completo ao atualizar role do membro:', error);
    throw error;
  }
}