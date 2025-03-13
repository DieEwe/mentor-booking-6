
export type EventStatus = 'open' | 'progress' | 'seekbackup' | 'found' | 'closed' | 'old' | 'archived';

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

export const mockEvents: Event[] = [
  {
    id: '1',
    date: '2025-03-15',
    time: '14:00',
    coachName: 'John Doe',
    company: 'Tech Corp',
    column: 1,
    status: 'open'
  },
  {
    id: '2',
    date: '2025-03-18',
    time: '15:00',
    coachName: 'Jane Smith',
    company: 'Dev Inc',
    column: 2,
    mentorId: '2',
    status: 'found'
  },
  {
    id: '3',
    date: '2025-03-22',
    time: '16:00',
    coachName: 'Mike Johnson',
    company: 'Code Co',
    column: 3,
    status: 'progress'
  },
  {
    id: '4',
    date: '2025-04-05',
    time: '10:00',
    coachName: 'Sarah Williams',
    company: 'Data Systems',
    column: 1,
    status: 'open'
  },
  {
    id: '5',
    date: '2025-04-12',
    time: '14:30',
    coachName: 'Robert Chen',
    company: 'AI Research',
    column: 2,
    status: 'progress'
  },
  {
    id: '6',
    date: '2025-04-15',
    time: '09:00',
    coachName: 'Emma Davis',
    company: 'Cloud Solutions',
    column: 3,
    mentorId: '3',
    status: 'found'
  },
  {
    id: '7',
    date: '2025-04-20',
    time: '11:00',
    coachName: 'Daniel Wilson',
    company: 'Security Systems',
    column: 2,
    status: 'seekbackup'
  },
  {
    id: '8',
    date: '2025-04-25',
    time: '16:30',
    coachName: 'Olivia Brown',
    company: 'Mobile Apps',
    column: 1,
    mentorId: '1',
    status: 'closed'
  },
  {
    id: '9',
    date: '2025-02-10',
    time: '13:30',
    coachName: 'James Miller',
    company: 'Legacy Systems',
    column: 3,
    status: 'archived'
  }
];
