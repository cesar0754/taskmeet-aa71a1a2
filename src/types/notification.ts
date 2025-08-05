export type NotificationType = 'info' | 'warning' | 'success' | 'error' | 'task' | 'meeting' | 'invitation';

export interface Notification {
  id: string;
  user_id: string;
  organization_id: string;
  title: string;
  message?: string;
  type: NotificationType;
  read: boolean;
  action_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateNotificationData {
  user_id: string;
  organization_id: string;
  title: string;
  message?: string;
  type?: NotificationType;
  action_url?: string;
}

export interface UpdateNotificationData {
  read?: boolean;
  message?: string;
  title?: string;
}