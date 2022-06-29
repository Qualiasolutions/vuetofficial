import { UserFullDetails } from './types';
import { vuetApi } from './api';
import { AuthDetails, CreateUserInviteRequest, UpdateUserInviteRequest, UpdateUserRequest, UserInviteResponse, UserResponse } from 'types/users';

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
        url: `core/user-simple/${body.user_id}/`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['User']
    }),
    getUserInvites: builder.query<UserInviteResponse[], number>({
      query: (familyId) => ({
        url: 'core/full-user-invite/'
      }),
      providesTags: ['UserInvite']
    }),
    createUserInvite: builder.mutation<UserInviteResponse, CreateUserInviteRequest>({
      query: (body) => ({
        url: 'core/user-invite/',
        method: 'POST',
        body
      }),
      invalidatesTags: ['UserInvite']
    }),
    updateUserInvite: builder.mutation<UserInviteResponse, UpdateUserInviteRequest>({
      query: (body) => ({
        url: `core/user-invite/${body.id}/`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['UserInvite']
    }),
  }),
  overrideExisting: true
});

export const {
  useGetUserFullDetailsQuery,
  useGetUserDetailsQuery,
  useUpdateUserDetailsMutation,
  useGetUserInvitesQuery,
  useCreateUserInviteMutation,
  useUpdateUserInviteMutation
} = extendedApi;
