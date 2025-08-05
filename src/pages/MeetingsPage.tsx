import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useOrganization } from '@/context/OrganizationContext';
import { useMeetings } from '@/hooks/useMeetings';
import { MeetingForm } from '@/components/meetings/MeetingForm';
import { MeetingsList } from '@/components/meetings/MeetingsList';
import { Meeting, CreateMeetingData, UpdateMeetingData } from '@/types/meeting';

export default function MeetingsPage() {
  const { organization, loading: orgLoading } = useOrganization();
  const { meetings, loading, createMeeting, updateMeeting, deleteMeeting } = useMeetings();
  const [showDialog, setShowDialog] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (orgLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const handleCreateMeeting = async (data: CreateMeetingData) => {
    setSubmitting(true);
    const success = await createMeeting(data);
    setSubmitting(false);
    
    if (success) {
      setShowDialog(false);
    }
  };

  const handleUpdateMeeting = async (data: UpdateMeetingData) => {
    if (!editingMeeting) return;
    
    setSubmitting(true);
    const success = await updateMeeting(editingMeeting.id, data);
    setSubmitting(false);
    
    if (success) {
      setShowDialog(false);
      setEditingMeeting(null);
    }
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setShowDialog(true);
  };

  const handleDeleteMeeting = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta reunião?')) {
      await deleteMeeting(id);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingMeeting(null);
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Reuniões"
        description="Gerencie as reuniões da sua organização"
        action={
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Reunião
          </Button>
        }
      />

      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <MeetingsList
            meetings={meetings}
            onEditMeeting={handleEditMeeting}
            onDeleteMeeting={handleDeleteMeeting}
          />
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingMeeting ? 'Editar Reunião' : 'Nova Reunião'}
            </DialogTitle>
          </DialogHeader>
          <MeetingForm
            meeting={editingMeeting || undefined}
            onSubmit={editingMeeting ? handleUpdateMeeting : handleCreateMeeting}
            onCancel={handleCloseDialog}
            loading={submitting}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}