import { supabase } from '@/integrations/supabase/client';
import { Meeting, MeetingAttendee, CreateMeetingData, UpdateMeetingData } from '@/types/meeting';

export async function fetchMeetings(organizationId: string): Promise<Meeting[]> {
  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('organization_id', organizationId)
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Erro ao buscar reuniões:', error);
    throw error;
  }

  return data || [];
}

export async function fetchMeetingById(id: string): Promise<Meeting | null> {
  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar reunião:', error);
    throw error;
  }

  return data;
}

export async function createMeeting(
  organizationId: string,
  meetingData: CreateMeetingData
): Promise<Meeting> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  const { attendee_ids, ...meetingPayload } = meetingData;

  const { data, error } = await supabase
    .from('meetings')
    .insert([{
      ...meetingPayload,
      organization_id: organizationId,
      created_by: user.id
    }])
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar reunião:', error);
    throw error;
  }

  // Adicionar participantes se especificado
  if (attendee_ids && attendee_ids.length > 0) {
    await addMeetingAttendees(data.id, attendee_ids);
  }

  return data;
}

export async function updateMeeting(
  id: string,
  meetingData: UpdateMeetingData
): Promise<Meeting> {
  const { data, error } = await supabase
    .from('meetings')
    .update(meetingData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar reunião:', error);
    throw error;
  }

  return data;
}

export async function deleteMeeting(id: string): Promise<void> {
  const { error } = await supabase
    .from('meetings')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar reunião:', error);
    throw error;
  }
}

export async function fetchMeetingAttendees(meetingId: string): Promise<MeetingAttendee[]> {
  const { data, error } = await supabase
    .from('meeting_attendees')
    .select('*')
    .eq('meeting_id', meetingId);

  if (error) {
    console.error('Erro ao buscar participantes:', error);
    throw error;
  }

  return (data || []) as MeetingAttendee[];
}

export async function addMeetingAttendees(meetingId: string, userIds: string[]): Promise<void> {
  const attendees = userIds.map(userId => ({
    meeting_id: meetingId,
    user_id: userId,
    status: 'pending' as const
  }));

  const { error } = await supabase
    .from('meeting_attendees')
    .insert(attendees);

  if (error) {
    console.error('Erro ao adicionar participantes:', error);
    throw error;
  }
}

export async function updateAttendeeStatus(
  meetingId: string,
  userId: string,
  status: 'pending' | 'accepted' | 'declined'
): Promise<void> {
  const { error } = await supabase
    .from('meeting_attendees')
    .update({ status })
    .eq('meeting_id', meetingId)
    .eq('user_id', userId);

  if (error) {
    console.error('Erro ao atualizar status do participante:', error);
    throw error;
  }
}

export async function removeMeetingAttendee(meetingId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('meeting_attendees')
    .delete()
    .eq('meeting_id', meetingId)
    .eq('user_id', userId);

  if (error) {
    console.error('Erro ao remover participante:', error);
    throw error;
  }
}