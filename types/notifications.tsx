import { UserResponse } from './users';

export type CreatePushTokenRequest = {
  token: string;
};

export type PushTokenResponse = {
  id: number;
  token: string;
  user: number;
  active: boolean;
};
