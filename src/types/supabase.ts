
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          created_at: string
          owner_id: string
          logo_url?: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          owner_id: string
          logo_url?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          owner_id?: string
          logo_url?: string
        }
      }
      organization_members: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          role: string
          created_at: string
          email: string
          name: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          role: string
          created_at?: string
          email: string
          name: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          role?: string
          created_at?: string
          email?: string
          name?: string
        }
      }
      work_groups: {
        Row: {
          id: string
          name: string
          organization_id: string
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          name: string
          organization_id: string
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          name?: string
          organization_id?: string
          created_at?: string
          created_by?: string
        }
      }
      group_members: {
        Row: {
          id: string
          group_id: string
          member_id: string
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          member_id: string
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          member_id?: string
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description?: string
          status: 'pending' | 'in_progress' | 'completed'
          due_date?: string
          organization_id: string
          assigned_to?: string
          group_id?: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          status?: 'pending' | 'in_progress' | 'completed'
          due_date?: string
          organization_id: string
          assigned_to?: string
          group_id?: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          status?: 'pending' | 'in_progress' | 'completed'
          due_date?: string
          organization_id?: string
          assigned_to?: string
          group_id?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      meetings: {
        Row: {
          id: string
          title: string
          description?: string
          start_time: string
          end_time: string
          location?: string
          organization_id: string
          group_id?: string
          created_by: string
          created_at: string
          updated_at: string
          google_event_id?: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          start_time: string
          end_time: string
          location?: string
          organization_id: string
          group_id?: string
          created_by: string
          created_at?: string
          updated_at?: string
          google_event_id?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          start_time?: string
          end_time?: string
          location?: string
          organization_id?: string
          group_id?: string
          created_by?: string
          created_at?: string
          updated_at?: string
          google_event_id?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          organization_id: string
          title: string
          message: string
          type: 'task' | 'meeting' | 'system'
          reference_id?: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organization_id: string
          title: string
          message: string
          type: 'task' | 'meeting' | 'system'
          reference_id?: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string
          title?: string
          message?: string
          type?: 'task' | 'meeting' | 'system'
          reference_id?: string
          read?: boolean
          created_at?: string
        }
      }
    }
  }
}
