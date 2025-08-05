import { NotificationsList } from '@/components/notifications/NotificationsList';
import DashboardLayout from '@/components/layout/DashboardLayout';

export const NotificationsPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <NotificationsList />
      </div>
    </DashboardLayout>
  );
};