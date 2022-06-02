import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Constants from 'expo-constants';
import { AllEntities, UserFullDetails } from './types';
import { AllTasks } from './types';
import { EntireState } from 'reduxStore/types';
import { EntityResponseType } from 'types/entities';
import { FamilyResponseType } from 'types/families';
import { TaskResponseType } from 'types/tasks';
import { AuthDetails } from 'types/users';
const vuetApiUrl = Constants.manifest?.extra?.vuetApiUrl;

const normalizeData = (data: { id: number }[]) => {
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
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${vuetApiUrl}`,
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = (getState() as EntireState).authentication.jwtAccessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  endpoints: (builder) => ({
    getAllTasks: builder.query<AllTasks, number>({
      query: () => ({
        url: 'core/task',
        responseHandler: async (response) => {
          const responseJson: TaskResponseType[] = await response.json();
          return normalizeData(responseJson);
        }
      })
    }),
    getAllEntities: builder.query<AllEntities, number>({
      query: () => ({
        url: 'core/entity',
        responseHandler: async (response) => {
          const responseJson: EntityResponseType[] = await response.json();
          return normalizeData(responseJson);
        }
      })
    }),
    getUserFullDetails: builder.query<UserFullDetails, number>({
      query: (user_id) => ({
        url: `core/user/${user_id}`
      })
    }),
    getUserDetails: builder.query<AuthDetails, void>({
      query: () => ({
        url: 'auth/details',
      })
    }),
  })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAllTasksQuery, useGetAllEntitiesQuery, useGetUserFullDetailsQuery, useGetUserDetailsQuery } = vuetApi;
