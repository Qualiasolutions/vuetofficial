import {combineReducers} from 'redux';
import allActionNames from './actionNames';

const {
  SET_ACCESS_TOKEN,
  SET_REFRESH_TOKEN,
  SET_USERNAME,
} = allActionNames

const INITIAL_AUTH_STATE = {
  username: null,
  jwtAccessToken: null,
  jwtRefreshToken: null,
};

type AuthReducerActionType = {
  type: keyof typeof allActionNames;
  value: string;
}

const authReducer = (state = INITIAL_AUTH_STATE, action: AuthReducerActionType) => {
  switch (action.type) {
    case SET_ACCESS_TOKEN:
      return {...state, jwtAccessToken: action.value};
    case SET_REFRESH_TOKEN:
      return {...state, jwtRefreshToken: action.value};
    case SET_USERNAME:
      return {...state, username: action.value};
    default:
      return state;
  }
};