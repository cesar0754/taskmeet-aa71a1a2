import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Video, Edit, Trash2 } from 'lucide-react';
import { Meeting } from '@/types/meeting';

interface MeetingCardProps {
  meeting: Meeting;
  onEdit: (meeting: Meeting) => void;
  onDelete: (id: string) => void;
}

export function MeetingCard({ meeting, onEdit, onDelete }: MeetingCardProps) {
  const startDate = new Date(meeting.start_time);
  const endDate = new Date(meeting.end_time);
  const now = new Date();
  
  const isUpcoming = startDate > now;
  const isOngoing = startDate <= now && endDate >= now;
  const isPast = endDate < now;

  const getStatusBadge = () => {
    if (isOngoing) return <Badge variant="default">Em andamento</Badge>;
    if (isUpcoming) return <Badge variant="secondary">Agendada</Badge>;
    return <Badge variant="outline">Finalizada</Badge>;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{meeting.title}</CardTitle>
          {getStatusBadge()}
        </div>
        {meeting.description && (
          <p className="text-sm text-muted-foreground">{meeting.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>
            {format(startDate, 'dd/MM/yyyy', { locale: ptBR })}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>
            {format(startDate, 'HH:mm', { locale: ptBR })} - {format(endDate, 'HH:mm', { locale: ptBR })}
          </span>
        </div>

        {meeting.location && (
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{meeting.location}</span>
          </div>
        )}

        {meeting.meeting_url && (
          <div className="flex items-center space-x-2 text-sm">
            <Video className="h-4 w-4 text-muted-foreground" />
            <a 
              href={meeting.meeting_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Entrar na reunião
            </a>
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(meeting)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(meeting.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}