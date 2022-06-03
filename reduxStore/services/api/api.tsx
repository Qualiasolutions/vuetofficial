import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import Constants from 'expo-constants';
import { AllEntities, UserFullDetails } from './types';
import { AllTasks } from './types';
import { EntireState } from 'reduxStore/types';
import { EntityResponseType } from 'types/entities';
import { TaskResponseType } from 'types/tasks';
import { AuthDetails } from 'types/users';
import customFetchBase from './customFetchBase';
const vuetApiUrl = Constants.manifest?.extra?.vuetApiUrl;

export const normalizeData = (data: { id: number }[]) => {
  return {
    ids: data.map(({ id }) => id),
    byId: data.reduce(
      (prev, next) => ({
        ...prev,
        [next.id]: next
      }),
      {}
    )
  };
};

// Define a service using a base URL and expected endpoints
export const vuetApi = createApi({
  reducerPath: 'vuetApi',
  tagTypes: ['Entity', 'Task'],
  baseQuery: customFetchBase,
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    getUserFullDetails: builder.query<UserFullDetails, number>({
      query: (user_id) => ({
        url: `core/user/${user_id}`
      })
    }),
    getUserDetails: builder.query<AuthDetails, void>({
      query: () => ({
        url: 'auth/details'
      })
    })
  })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetUserFullDetailsQuery,
  useGetUserDetailsQuery
} = vuetApi;
