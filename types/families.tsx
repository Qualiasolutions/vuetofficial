import { UserFullResponse } from './users';

export type UpdateFamilyRequest = {
  familyId: number;
  formData?: FormData;
};

export type FamilyResponse = {
  id: number;
  users: UserFullResponse[];
  image: string;
  presigned_image_url: string;
};
