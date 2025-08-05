import React from 'react';
import { Meeting } from '@/types/meeting';
import { MeetingCard } from './MeetingCard';

interface MeetingsListProps {
  meetings: Meeting[];
  onEditMeeting: (meeting: Meeting) => void;
  onDeleteMeeting: (id: string) => void;
}

export function MeetingsList({ meetings, onEditMeeting, onDeleteMeeting }: MeetingsListProps) {
  if (meetings.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhuma reunião encontrada.</p>
        <p className="text-sm">Clique em "Nova Reunião" para começar.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {meetings.map((meeting) => (
        <MeetingCard
          key={meeting.id}
          meeting={meeting}
          onEdit={onEditMeeting}
          onDelete={onDeleteMeeting}
        />
      ))}
    </div>
  );
}