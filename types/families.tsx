import { FamilyUser } from './users';

export type FamilyResponseType = {
  id: number;
  users: FamilyUser[];
  image: string;
};


export type UpdateFamilyRequest = {
  familyId: number;
  formData?: FormData;
};

export type FamilyResponse = {
  image: string;
};
