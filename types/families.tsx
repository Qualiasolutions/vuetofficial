import { FamilyUser } from './users';

export type FamilyResponseType = {
  id: number | null;
  users: FamilyUser[];
};
