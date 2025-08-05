import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CreateMeetingData, UpdateMeetingData, Meeting } from '@/types/meeting';
import { Member } from '@/types/organization';
import { useOrganization } from '@/context/OrganizationContext';
import { fetchOrganizationMembers } from '@/services/organization/organizationService';

const meetingSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  start_time: z.string().min(1, 'Data/hora de início é obrigatória'),
  end_time: z.string().min(1, 'Data/hora de término é obrigatória'),
  location: z.string().optional(),
  meeting_url: z.string().url().optional().or(z.literal('')),
  attendee_ids: z.array(z.string()).optional(),
});

interface MeetingFormProps {
  meeting?: Meeting;
  onSubmit: (data: CreateMeetingData | UpdateMeetingData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function MeetingForm({ meeting, onSubmit, onCancel, loading }: MeetingFormProps) {
  const { organization } = useOrganization();
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<CreateMeetingData>({
    resolver: zodResolver(meetingSchema),
    defaultValues: meeting ? {
      title: meeting.title,
      description: meeting.description || '',
      start_time: meeting.start_time.slice(0, 16),
      end_time: meeting.end_time.slice(0, 16),
      location: meeting.location || '',
      meeting_url: meeting.meeting_url || '',
      attendee_ids: [],
    } : {
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      location: '',
      meeting_url: '',
      attendee_ids: [],
    }
  });

  useEffect(() => {
    const loadMembers = async () => {
      if (organization?.id) {
        try {
          const membersData = await fetchOrganizationMembers(organization.id);
          // Filtrar apenas membros que têm user_id (estão ativos)
          const activeMembers = membersData.filter(member => member.user_id);
          setMembers(activeMembers);
        } catch (error) {
          console.error('Erro ao carregar membros:', error);
        }
      }
    };
    
    loadMembers();
  }, [organization?.id]);

  const handleAttendeeChange = (userId: string, checked: boolean) => {
    let newAttendees;
    if (checked) {
      newAttendees = [...selectedAttendees, userId];
    } else {
      newAttendees = selectedAttendees.filter(id => id !== userId);
    }
    setSelectedAttendees(newAttendees);
    setValue('attendee_ids', newAttendees);
  };

  const handleFormSubmit = async (data: CreateMeetingData) => {
    const submitData = {
      ...data,
      start_time: new Date(data.start_time).toISOString(),
      end_time: new Date(data.end_time).toISOString(),
      attendee_ids: selectedAttendees,
    };
    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Nome da reunião"
        />
        {errors.title && (
          <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Descrição da reunião"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_time">Data/Hora de Início</Label>
          <Input
            id="start_time"
            type="datetime-local"
            {...register('start_time')}
          />
          {errors.start_time && (
            <p className="text-sm text-destructive mt-1">{errors.start_time.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="end_time">Data/Hora de Término</Label>
          <Input
            id="end_time"
            type="datetime-local"
            {...register('end_time')}
          />
          {errors.end_time && (
            <p className="text-sm text-destructive mt-1">{errors.end_time.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="location">Local</Label>
        <Input
          id="location"
          {...register('location')}
          placeholder="Local da reunião"
        />
      </div>

      <div>
        <Label htmlFor="meeting_url">Link da Reunião</Label>
        <Input
          id="meeting_url"
          type="url"
          {...register('meeting_url')}
          placeholder="https://meet.google.com/abc-defg-hij"
        />
        {errors.meeting_url && (
          <p className="text-sm text-destructive mt-1">{errors.meeting_url.message}</p>
        )}
      </div>

      <div>
        <Label>Participantes</Label>
        <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
          {members.map((member) => (
            <div key={member.id} className="flex items-center space-x-2">
              <Checkbox
                id={`attendee-${member.user_id}`}
                checked={selectedAttendees.includes(member.user_id!)}
                onCheckedChange={(checked) => 
                  handleAttendeeChange(member.user_id!, checked as boolean)
                }
              />
              <Label htmlFor={`attendee-${member.user_id}`} className="text-sm">
                {member.name} ({member.role})
              </Label>
            </div>
          ))}
          {members.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhum membro encontrado na organização
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : meeting ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </form>
  );
}