import allActionNames from './actionNames';
import { AuthState, AuthReducerActionType } from './types';

const { SET_ACCESS_TOKEN, SET_REFRESH_TOKEN, SET_USERNAME } = allActionNames;

const INITIAL_AUTH_STATE: AuthState = {
  username: '',
  jwtAccessToken: '',
  jwtRefreshToken: ''
};

const authReducer = (
  state = INITIAL_AUTH_STATE,
  action: AuthReducerActionType
) => {
  switch (action.type) {
    case SET_ACCESS_TOKEN:
      return { ...state, jwtAccessToken: action.value };
    case SET_REFRESH_TOKEN:
      return { ...state, jwtRefreshToken: action.value };
    case SET_USERNAME:
      return { ...state, username: action.value };
    default:
      return state;
  }
};

export { authReducer };
