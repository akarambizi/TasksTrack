// Simple mock user structure for testing
interface MockUser {
  id: number;
  email: string;
  password: string;
  name?: string;
}

const auth: MockUser[] = [
  { id: 1, email: 'test@example.com', password: 'Password!123', name: 'Test User' }
];

export default {
  auth
};
