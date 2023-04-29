import { IRole, IUserData, IUserPassword } from './types';
import { randomUUID } from 'crypto';

const rUID = randomUUID();
const rUID2 = randomUUID();

const saltRounds = 10;
const hashPassword = async (password: string) => {};

export const seedUserData: IUserData[] = [
  {
    id: rUID,
    email: 'test@test.com',
    name: 'admin',
    roleId: '1',
  },
  {
    id: rUID2,
    email: 'user@test.com',
    name: 'user',
    roleId: '2',
  },
];

export const seedRolesData: IRole[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'admin',
    // createdAt: new Date().toString(),
    // updatedAt: new Date().toString(),
  },
  {
    id: '2',
    name: 'User',
    description: 'user',
    // createdAt: new Date().toString(),
    // updatedAt: new Date().toString(),
  },
];

export const seedPasswordData: IUserPassword[] = [
  {
    id: '1',
    userId: rUID,
    password: 'admin',
  },
  {
    id: '2',
    userId: rUID2,
    password: 'user',
  },
];
