export type FamilyUser = {
  pk: number;
  family: number;
  username: string;
};

export type AuthDetails = {
  username: string;
  email: string;
  user_id: number;
};

export type CreateUserInviteRequest = {
  family: number;
  invitee: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  dob: string;
  member_colour: string;
};

export type UpdateUserInviteRequest = {
  id: number;
  family?: number;
  invitee?: number;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  dob?: string;
  member_colour?: string;
  rejected?: boolean;
};

export type UserInviteResponse = {
  id: number;
  family: number;
  invitee: {
    id: number;
    first_name: string;
    last_name: string;
  };
  first_name: string;
  last_name: string;
  phone_number: string;
  dob: string;
  member_colour: string;
  accepted: boolean;
  rejected: boolean;
};

export type UpdateUserRequest = {
  user_id: number;
  family?: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  dob?: string;
  member_colour?: string;
  has_done_setup?: boolean;
};

export type FormUpdateUserRequest = {
  userId: number;
  formData?: FormData;
};

export type UserResponse = {
  username: string;
  first_name: string;
  last_name: string;
  dob: string;
  member_colour: string;
  has_done_setup: boolean;
  profile_image: string;
};
