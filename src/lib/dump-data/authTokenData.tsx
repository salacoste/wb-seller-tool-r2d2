import { IAuthToken } from './types';
import { randomUUID } from 'crypto';

export const seedAuthTokenData: IAuthToken[] = [
  {
    id: 1,
    name: 'testDevAuthToken',
    token: 'a1b9d372-20ea-4a8d-afa0-6eb8dd479102', // randomUUID(),
    description:
      'test Token (non-production) which was gathered from the dev environment via DB seeding process',
  },
];

export default seedAuthTokenData;
