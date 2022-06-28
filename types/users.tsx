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

export type UpdateUserRequest = {
  user_id?: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  dob?: string;
  member_colour?: string;
  has_done_setup?: boolean;
};

export type UserResponse = {
  username: string;
  first_name: string;
  last_name: string;
  dob: string;
  member_colour: string;
  has_done_setup: boolean;
};
