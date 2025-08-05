export interface Meeting {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  meeting_url?: string;
  organization_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface MeetingAttendee {
  id: string;
  meeting_id: string;
  user_id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

export interface CreateMeetingData {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  meeting_url?: string;
  attendee_ids?: string[];
}

export interface UpdateMeetingData {
  title?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  meeting_url?: string;
}