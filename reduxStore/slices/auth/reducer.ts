import { AuthState } from './types';
import { ActionType, createReducer } from 'typesafe-actions';
import * as actions from './actions';

export type AuthAction = ActionType<typeof actions>;

const INITIAL_AUTH_STATE: AuthState = {
  username: '',
  jwtAccessToken: '',
  jwtRefreshToken: ''
};

const authReducer = createReducer(INITIAL_AUTH_STATE)
  .handleAction(actions.setAccessToken, (state, action) => ({
    ...state,
    jwtAccessToken: action.payload
  }))
  .handleAction(actions.setRefreshToken, (state, action) => ({
    ...state,
    jwtRefreshToken: action.payload
  }))
  .handleAction(actions.setUsername, (state, action) => ({
    ...state,
    username: action.payload
  }));

export { authReducer };
