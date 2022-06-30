import { UserFullDetails } from './types';
import { vuetApi } from './api';
import {
  AuthDetails,
  CreateUserInviteRequest,
  FormUpdateUserRequest,
  UpdateUserInviteRequest,
  UpdateUserRequest,
  UserInviteResponse,
  UserResponse
} from 'types/users';

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
    formUpdateUserDetails: builder.mutation<
      UserResponse,
      FormUpdateUserRequest
    >({
      query: (payload) => ({
        url: `core/user-simple/${payload.userId}/`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'multipart/form-data;'
        },
        body: payload.formData
      }),
      invalidatesTags: ['Family', 'User']
    }),
    getUserInvites: builder.query<UserInviteResponse[], number>({
      query: (familyId) => ({
        url: 'core/full-user-invite/'
      }),
      providesTags: ['UserInvite']
    }),
    createUserInvite: builder.mutation<
      UserInviteResponse,
      CreateUserInviteRequest
    >({
      query: (body) => ({
        url: 'core/user-invite/',
        method: 'POST',
        body
      }),
      invalidatesTags: ['UserInvite']
    }),
    updateUserInvite: builder.mutation<
      UserInviteResponse,
      UpdateUserInviteRequest
    >({
      query: (body) => ({
        url: `core/user-invite/${body.id}/`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['UserInvite']
    })
  }),
  overrideExisting: true
});

export const {
  useGetUserFullDetailsQuery,
  useGetUserDetailsQuery,
  useUpdateUserDetailsMutation,
  useFormUpdateUserDetailsMutation,
  useGetUserInvitesQuery,
  useCreateUserInviteMutation,
  useUpdateUserInviteMutation
} = extendedApi;
