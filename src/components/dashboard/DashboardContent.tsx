
import React from 'react';
import { Activity, Meeting, Task } from '@/hooks/useDashboardData';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import UpcomingMeetings from '@/components/dashboard/UpcomingMeetings';
import PendingTasks from '@/components/dashboard/PendingTasks';

interface DashboardContentProps {
  activities: Activity[];
  meetings: Meeting[];
  tasks: Task[];
}

const DashboardContent: React.FC<DashboardContentProps> = ({ activities, meetings, tasks }) => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PendingTasks tasks={tasks} />
        <UpcomingMeetings meetings={meetings} />
      </div>

      <div>
        <ActivityFeed activities={activities} />
      </div>
    </>
  );
};

export default DashboardContent;
