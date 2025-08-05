import { supabase } from '@/integrations/supabase/client';
import { Notification, CreateNotificationData, UpdateNotificationData } from '@/types/notification';

export const notificationService = {
  async getNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar notificações:', error);
      throw error;
    }

    return data || [];
  },

  async getUnreadCount(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('notifications')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) {
      console.error('Erro ao contar notificações não lidas:', error);
      return 0;
    }

    return data?.length || 0;
  },

  async createNotification(notificationData: CreateNotificationData): Promise<Notification | null> {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar notificação:', error);
      throw error;
    }

    return data;
  },

  async markAsRead(notificationId: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      return false;
    }

    return true;
  },

  async markAllAsRead(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) {
      console.error('Erro ao marcar todas notificações como lidas:', error);
      return false;
    }

    return true;
  },

  async deleteNotification(notificationId: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) {
      console.error('Erro ao deletar notificação:', error);
      return false;
    }

    return true;
  },

  async updateNotification(notificationId: string, updateData: UpdateNotificationData): Promise<Notification | null> {
    const { data, error } = await supabase
      .from('notifications')
      .update(updateData)
      .eq('id', notificationId)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar notificação:', error);
      throw error;
    }

    return data;
  }
};