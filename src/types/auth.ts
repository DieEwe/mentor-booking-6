
export type UserRole = 'guest' | 'mentor' | 'coach';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  company?: string;
}

// Mock data - TODO: Replace with Supabase Authentication
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'coach@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'coach',
    company: 'Tech Corp'
  },
  {
    id: '2',
    email: 'mentor@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'mentor'
  }
];
