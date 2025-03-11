
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
  },
  {
    id: '4',
    date: '2024-03-25',
    time: '10:00',
    coachName: 'Sarah Williams',
    company: 'Data Systems',
    column: 1,
    status: 'wanted'
  },
  {
    id: '5',
    date: '2024-03-25',
    time: '14:30',
    coachName: 'Robert Chen',
    company: 'AI Research',
    column: 2,
    status: 'process'
  },
  {
    id: '6',
    date: '2024-03-27',
    time: '09:00',
    coachName: 'Emma Davis',
    company: 'Cloud Solutions',
    column: 3,
    mentorId: '3',
    status: 'found'
  },
  {
    id: '7',
    date: '2024-03-28',
    time: '11:00',
    coachName: 'Daniel Wilson',
    company: 'Security Systems',
    column: 2,
    status: 'wanted'
  },
  {
    id: '8',
    date: '2024-03-30',
    time: '16:30',
    coachName: 'Olivia Brown',
    company: 'Mobile Apps',
    column: 1,
    mentorId: '1',
    status: 'found'
  }
];
