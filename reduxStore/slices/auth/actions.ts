import {
    SET_ACCESS_TOKEN,
    SET_REFRESH_TOKEN,
    SET_USERNAME
  } from './actionNames';
  import { AuthReducerActionType } from './types';
  
  function setAccessToken(token: string): AuthReducerActionType {
    return {
      type: SET_ACCESS_TOKEN,
      value: token
    };
  }
  
  function setRefreshToken(token: string): AuthReducerActionType {
    return {
      type: SET_REFRESH_TOKEN,
      value: token
    };
  }
  
  function setUsername(username: string): AuthReducerActionType {
    return {
      type: SET_USERNAME,
      value: username
    };
  }
  
  export { setAccessToken, setRefreshToken, setUsername };
  