import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Constants from 'expo-constants';
import { AllEntities } from 'reduxStore/slices/entities/types';
import { AllTasks } from 'reduxStore/slices/tasks/types';
import { EntireState } from 'reduxStore/types';
import { EntityResponseType } from 'types/entities';
import { TaskResponseType } from 'types/tasks';
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
    getAllTasks: builder.query<AllTasks, void>({
      query: () => ({
        url: 'core/task',
        responseHandler: async (response) => {
          const responseJson: TaskResponseType[] = await response.json();
          return normalizeData(responseJson);
        }
      })
    }),
    getAllEntities: builder.query<AllEntities, void>({
      query: () => ({
        url: 'core/entity',
        responseHandler: async (response) => {
          const responseJson: EntityResponseType[] = await response.json();
          return normalizeData(responseJson);
        }
      })
    })
  })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAllTasksQuery, useGetAllEntitiesQuery } = vuetApi;
