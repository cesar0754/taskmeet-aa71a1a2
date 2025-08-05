import { useState, useEffect } from 'react';
import { useOrganization } from '@/context/OrganizationContext';
import { Meeting, CreateMeetingData, UpdateMeetingData } from '@/types/meeting';
import * as meetingService from '@/services/meetingService';
import { toast } from '@/hooks/use-toast';

export function useMeetings() {
  const { organization } = useOrganization();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMeetings = async () => {
    if (!organization) return;

    try {
      setLoading(true);
      const data = await meetingService.fetchMeetings(organization.id);
      setMeetings(data);
    } catch (error) {
      console.error('Erro ao carregar reuniões:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar reuniões",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createMeeting = async (meetingData: CreateMeetingData): Promise<Meeting | null> => {
    if (!organization) return null;

    try {
      const newMeeting = await meetingService.createMeeting(organization.id, meetingData);
      setMeetings(prev => [...prev, newMeeting]);
      toast({
        title: "Sucesso",
        description: "Reunião criada com sucesso",
      });
      return newMeeting;
    } catch (error) {
      console.error('Erro ao criar reunião:', error);
      toast({
        title: "Erro",
        description: "Falha ao criar reunião",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateMeeting = async (id: string, meetingData: UpdateMeetingData): Promise<boolean> => {
    try {
      const updatedMeeting = await meetingService.updateMeeting(id, meetingData);
      setMeetings(prev => prev.map(meeting => 
        meeting.id === id ? updatedMeeting : meeting
      ));
      toast({
        title: "Sucesso",
        description: "Reunião atualizada com sucesso",
      });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar reunião:', error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar reunião",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteMeeting = async (id: string): Promise<boolean> => {
    try {
      await meetingService.deleteMeeting(id);
      setMeetings(prev => prev.filter(meeting => meeting.id !== id));
      toast({
        title: "Sucesso",
        description: "Reunião removida com sucesso",
      });
      return true;
    } catch (error) {
      console.error('Erro ao deletar reunião:', error);
      toast({
        title: "Erro",
        description: "Falha ao remover reunião",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    loadMeetings();
  }, [organization]);

  return {
    meetings,
    loading,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    refetch: loadMeetings
  };
}