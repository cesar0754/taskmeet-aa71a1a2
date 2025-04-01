
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Meeting {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  location?: string;
}

interface UpcomingMeetingsProps {
  meetings: Meeting[];
}

const UpcomingMeetings: React.FC<UpcomingMeetingsProps> = ({ meetings }) => {
  const formatTime = (date: Date) => {
    return format(date, 'HH:mm', { locale: ptBR });
  };

  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM", { locale: ptBR });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Próximas Reuniões</CardTitle>
        <Button variant="ghost" size="sm" className="gap-1">
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Ver agenda</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {meetings.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            Nenhuma reunião agendada
          </div>
        ) : (
          meetings.map((meeting) => (
            <div key={meeting.id} className="border rounded-md p-3 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{meeting.title}</h4>
                {isToday(meeting.startTime) && (
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
                    Hoje
                  </Badge>
                )}
              </div>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(meeting.startTime)}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                  </span>
                </div>
              </div>
              {meeting.location && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{meeting.location}</span>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingMeetings;
