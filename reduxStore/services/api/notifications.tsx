import { vuetApi } from './api';
import { CreatePushTokenRequest, PushTokenResponse } from 'types/notifications';

const extendedApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    createPushToken: builder.mutation<PushTokenResponse, CreatePushTokenRequest>({
      query: (body) => ({
        url: 'notifications/push-token/',
        method: 'POST',
        body: body
      }),
      invalidatesTags: ['PushToken']
    }),
    getPushTokens: builder.query<PushTokenResponse[], number>({
        query: (userId) => ({
          url: 'notifications/push-token/',
          method: 'GET',
        }),
        providesTags: ['PushToken']
      }),
  }),
  overrideExisting: true
});

export const { useCreatePushTokenMutation, useGetPushTokensQuery } = extendedApi;
