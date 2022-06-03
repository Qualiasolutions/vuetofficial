import {
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchArgs,
  BaseQueryFn
} from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import {
  setAccessToken,
  setRefreshToken,
  setUsername
} from 'reduxStore/slices/auth/actions';
import Constants from 'expo-constants';
import { EntireState } from 'reduxStore/types';
import { refreshTokenAsync, verifyTokenAsync } from 'utils/authRequests';
const vuetApiUrl = Constants.manifest?.extra?.vuetApiUrl;

const mutex = new Mutex();

const baseUrl = `http://${vuetApiUrl}`;
const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    const token = (getState() as EntireState).authentication.jwtAccessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    return headers;
  }
});

const customFetchBase: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if ((result.error?.data as any)?.code === 'token_not_valid') {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      const jwtRefreshToken = (api.getState() as EntireState).authentication
        .jwtRefreshToken;
      try {
        if (jwtRefreshToken) {
          const verifyRefreshResponse = await verifyTokenAsync(jwtRefreshToken);
          if (verifyRefreshResponse.code) {
            api.dispatch(setAccessToken(''));
            api.dispatch(setRefreshToken(''));
            api.dispatch(setUsername(''));
          } else {
            const refreshedAccessCode = (
              await refreshTokenAsync(jwtRefreshToken)
            ).access;

            api.dispatch(setAccessToken(refreshedAccessCode));
            result = await baseQuery(args, api, extraOptions);
          }
        }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export default customFetchBase;
