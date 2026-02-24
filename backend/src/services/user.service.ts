import { User } from '../types/index.js';
import { NotFoundError } from '../types/errors.js';

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'test@test.com',
    password: '$2b$10$9YxpyTea9f5PqSdsqZ6Ys.CFNVkEVVv3r8HiwmbrYVXabsBkHEWVi', // password123
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: '$2b$10$9YxpyTea9f5PqSdsqZ6Ys.CFNVkEVVv3r8HiwmbrYVXabsBkHEWVi', // password123
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: '$2b$10$9YxpyTea9f5PqSdsqZ6Ys.CFNVkEVVv3r8HiwmbrYVXabsBkHEWVi', // password123
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
  {
    id: '4',
    name: 'Bob Williams',
    email: 'bob@example.com',
    password: '$2b$10$9YxpyTea9f5PqSdsqZ6Ys.CFNVkEVVv3r8HiwmbrYVXabsBkHEWVi', // password123
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04'),
  },
  {
    id: '5',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    password: '$2b$10$9YxpyTea9f5PqSdsqZ6Ys.CFNVkEVVv3r8HiwmbrYVXabsBkHEWVi', // password123
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: '6',
    name: 'Diana Prince',
    email: 'diana@example.com',
    password: '$2b$10$9YxpyTea9f5PqSdsqZ6Ys.CFNVkEVVv3r8HiwmbrYVXabsBkHEWVi', // password123
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06'),
  },
];

export const findUserByEmail = (email: string): User | undefined => {
  return mockUsers.find((user) => user.email === email);
};

export const getUserById = (id: string): User => {
  const user = mockUsers.find((user) => user.id === id);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
};
