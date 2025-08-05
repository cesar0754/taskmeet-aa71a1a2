import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Notification } from '@/types/notification';

interface UseNotificationsRealtimeProps {
  onNewNotification: (notification: Notification) => void;
  onNotificationUpdate: (notification: Notification) => void;
  onNotificationDelete: (notificationId: string) => void;
}

export const useNotificationsRealtime = ({
  onNewNotification,
  onNotificationUpdate,
  onNotificationDelete
}: UseNotificationsRealtimeProps) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Nova notificação recebida:', payload.new);
          onNewNotification(payload.new as Notification);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Notificação atualizada:', payload.new);
          onNotificationUpdate(payload.new as Notification);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Notificação deletada:', payload.old);
          onNotificationDelete(payload.old.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, onNewNotification, onNotificationUpdate, onNotificationDelete]);
};