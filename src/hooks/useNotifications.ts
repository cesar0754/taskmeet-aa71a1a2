import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useOrganization } from '@/context/OrganizationContext';
import { notificationService } from '@/services/notificationService';
import { Notification, CreateNotificationData } from '@/types/notification';
import { useToast } from '@/hooks/use-toast';
import { useNotificationsRealtime } from './useNotificationsRealtime';

export const useNotifications = () => {
  const { user } = useAuth();
  const { organization } = useOrganization();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadNotifications();
      loadUnreadCount();
    }
  }, [user]);

  // Configurar notificações em tempo real
  useNotificationsRealtime({
    onNewNotification: (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Mostrar toast para notificações importantes
      if (notification.type === 'error' || notification.type === 'warning') {
        toast({
          title: notification.title,
          description: notification.message,
          variant: notification.type === 'error' ? 'destructive' : 'default'
        });
      }
    },
    onNotificationUpdate: (notification) => {
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? notification : n)
      );
      // Atualizar contagem se mudou o status de lida
      if (notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    },
    onNotificationDelete: (notificationId) => {
      const notification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }
  });

  const loadNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await notificationService.getNotifications(user.id);
      setNotifications(data);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar notificações',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    if (!user) return;
    
    try {
      const count = await notificationService.getUnreadCount(user.id);
      setUnreadCount(count);
    } catch (error) {
      console.error('Erro ao carregar contagem de não lidas:', error);
    }
  };

  const createNotification = async (data: Omit<CreateNotificationData, 'user_id' | 'organization_id'>) => {
    if (!user || !organization) return null;

    try {
      const notificationData: CreateNotificationData = {
        ...data,
        user_id: user.id,
        organization_id: organization.id
      };

      const newNotification = await notificationService.createNotification(notificationData);
      
      if (newNotification) {
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
      }

      return newNotification;
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar notificação',
        variant: 'destructive'
      });
      return null;
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const success = await notificationService.markAsRead(notificationId);
      
      if (success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, read: true }
              : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao marcar notificação como lida',
        variant: 'destructive'
      });
      return false;
    }
  };

  const markAllAsRead = async () => {
    if (!user) return false;

    try {
      const success = await notificationService.markAllAsRead(user.id);
      
      if (success) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, read: true }))
        );
        setUnreadCount(0);
        toast({
          title: 'Sucesso',
          description: 'Todas as notificações foram marcadas como lidas'
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao marcar notificações como lidas',
        variant: 'destructive'
      });
      return false;
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const success = await notificationService.deleteNotification(notificationId);
      
      if (success) {
        const notification = notifications.find(n => n.id === notificationId);
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        
        if (notification && !notification.read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao deletar notificação',
        variant: 'destructive'
      });
      return false;
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications: loadNotifications
  };
};