import allActionNames from './actionNames';

type AuthState = {
  username: string;
  jwtAccessToken: string;
  jwtRefreshToken: string;
};

export { AuthState };
