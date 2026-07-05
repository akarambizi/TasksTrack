// Simple mock user structure for testing
interface MockUser {
  id: number;
  email: string;
  password: string;
  name?: string;
}

const auth: MockUser[] = [
  { id: 1, email: 'test@example.com', password: 'Password!123', name: 'Test User' },
  { id: 2, email: 'admin@example.com', password: 'Admin!12345', name: 'Admin User' },
  { id: 3, email: 'coach@example.com', password: 'Coach!12345', name: 'Coach User' },
  { id: 4, email: 'observer@example.com', password: 'Observer!12345', name: 'Observer User' }
];

export default {
  auth
};
