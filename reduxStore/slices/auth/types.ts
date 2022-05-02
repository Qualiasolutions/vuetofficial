import allActionNames from './actionNames';

type AuthState = {
  username: string;
  jwtAccessToken: string;
  jwtRefreshToken: string;
};

type AuthReducerActionType = {
  type: keyof typeof allActionNames;
  value: string;
};

export { AuthState, AuthReducerActionType };
