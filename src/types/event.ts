
export type EventStatus = 'wanted' | 'process' | 'found';

export interface Event {
  id: string;
  date: string;
  time: string;
  coachName: string;
  company: string;
  column: number;
  mentorId?: string;
  status: EventStatus;
}

// Mock data - TODO: Replace with Supabase Database
export const mockEvents: Event[] = [
  {
    id: '1',
    date: '2024-03-20',
    time: '14:00',
    coachName: 'John Doe',
    company: 'Tech Corp',
    column: 1,
    status: 'wanted'
  },
  {
    id: '2',
    date: '2024-03-21',
    time: '15:00',
    coachName: 'Jane Smith',
    company: 'Dev Inc',
    column: 2,
    mentorId: '2',
    status: 'found'
  },
  {
    id: '3',
    date: '2024-03-22',
    time: '16:00',
    coachName: 'Mike Johnson',
    company: 'Code Co',
    column: 3,
    status: 'process'
  }
];
