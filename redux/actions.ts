import {
  SET_ACCESS_TOKEN,
  SET_REFRESH_TOKEN,
  SET_USERNAME,
} from './actionNames';

function setAccessToken(token: string) {
  return {
    type: SET_ACCESS_TOKEN,
    token,
  };
}

function setRefreshToken(token: string) {
  return {
    type: SET_REFRESH_TOKEN,
    value: token,
  };
}

function setUsername(username: string) {
  return {
    type: SET_USERNAME,
    value: username,
  };
}

export {
  setAccessToken,
  setRefreshToken,
  setUsername
}