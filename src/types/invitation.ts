
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
