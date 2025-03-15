export type EventStatus = 'open' | 'progress' | 'seekbackup' | 'found' | 'closed' | 'old' | 'archived';

export interface Event {
  id: string | number;
  title: string;
  company: string;
  date: string;  // Changed from string | Date to just string for consistency
  time: string;
  description: string;
  coach_id: string | number;
  coachName: string;
  status: EventStatus;  // Use the EventStatus type instead of string
  requestingMentors: string[];
  acceptedMentors: string[];
  backupRequests: string[];
  backupMentors: string[];
  column?: number;  // Make it optional since it's used in UI but not in DB
}
