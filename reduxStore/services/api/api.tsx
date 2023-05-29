import { createApi } from '@reduxjs/toolkit/query/react';

import customFetchBase from './customFetchBase';
import { AllCategories } from './types';
import { Category } from 'types/categories';

export const normalizeData = (data: { id: number; name: string }[]) => {
  return {
    ids: data.map(({ id }) => id),
    byId: data.reduce(
      (prev, next) => ({
        ...prev,
        [next.id]: next
      }),
      {}
    ),
    byName: data.reduce(
      (prev, next) => ({
        ...prev,
        [next.name]: next
      }),
      {}
    )
  };
};

// Define a service using a base URL and expected endpoints
export const vuetApi = createApi({
  reducerPath: 'vuetApi',
  tagTypes: [
    'Entity',
    'Task',
    'TaskLimit',
    'Period',
    'TaskCompletionForm',
    'Category',
    'User',
    'UserInvite',
    'Family',
    'PushToken',
    'Country',
    'Holiday',
    'Friendships',
    'FamilyCategoryViewPermission',
    'PreferredDays'
  ],
  baseQuery: customFetchBase,
  endpoints: (builder) => ({
    getAllCategories: builder.query<AllCategories, void>({
      query: () => ({
        url: 'core/category',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: Category[] = await response.json();
            return normalizeData(responseJson);
          } else {
            // Just return the error data
            return response.json();
          }
        }
      }),
      providesTags: ['Category']
    })
  })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAllCategoriesQuery } = vuetApi;
