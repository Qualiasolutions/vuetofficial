import { UserFullDetails } from './types';
import { vuetApi } from './api';
import { AuthDetails, UpdateUserRequest, UserResponse } from 'types/users';

const extendedApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserFullDetails: builder.query<UserFullDetails, number>({
      query: (user_id) => ({
        url: `core/user/${user_id}`
      }),
      providesTags: ['User']
    }),
    getUserDetails: builder.query<AuthDetails, string>({
      query: () => ({
        url: 'auth/details/'
      }),
      providesTags: ['User']
    }),
    updateUserDetails: builder.mutation<UserResponse, UpdateUserRequest>({
      query: (body) => ({
        url: `core/user/${body.user_id}/`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['User']
    })
  }),
  overrideExisting: true
});

export const {
  useGetUserFullDetailsQuery,
  useGetUserDetailsQuery,
  useUpdateUserDetailsMutation
} = extendedApi;
