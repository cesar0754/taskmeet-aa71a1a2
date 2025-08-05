export interface Group {
  id: string;
  name: string;
  description?: string;
  organization_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  member_id: string;
  role: string;
  created_at: string;
  // Dados do membro via join
  member?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface CreateGroupData {
  name: string;
  description?: string;
  organization_id: string;
}

export interface UpdateGroupData {
  name?: string;
  description?: string;
}

export interface AddGroupMemberData {
  group_id: string;
  member_id: string;
  role?: string;
}