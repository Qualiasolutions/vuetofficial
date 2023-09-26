import { vuetApi } from './api';
import {
  AuthDetails,
  CreateUserInviteRequest,
  FormUpdateUserRequest,
  UpdateUserInviteRequest,
  UpdateUserRequest,
  UserInviteResponse,
  UserResponse,
  UserFullResponse,
  SecureUpdateUserRequest,
  CategorySetupCompletion,
  ReferencesSetupCompletion,
  EntityTypeSetupCompletion
} from 'types/users';
import { DeleteRequest } from 'types/apiBase';

const userApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserFullDetails: builder.query<UserFullResponse, number>({
      query: (user_id) => ({
        url: `core/user/${user_id}/`
      }),
      providesTags: ['User']
    }),
    getUserMinimalDetails: builder.query<
      { id: number; phone_number: string; member_colour: string },
      string
    >({
      query: (phone_number) => ({
        url: `core/user-minimal/${phone_number}/`
      }),
      providesTags: ['User']
    }),
    getUserMinimalDetailsFromId: builder.query<
      { id: number; phone_number: string; member_colour: string },
      number
    >({
      query: (userId) => ({
        url: `core/user-id-minimal/${userId}/`
      }),
      providesTags: ['User']
    }),
    getUserDetails: builder.query<AuthDetails, void>({
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
    secureUpdateUserDetails: builder.mutation<
      UserResponse,
      SecureUpdateUserRequest
    >({
      query: (body) => ({
        url: `core/user-secure-update/${body.user_id}/`,
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
    getUserInvites: builder.query<UserInviteResponse[], void>({
      query: () => ({
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
    }),
    deleteUserInvite: builder.mutation<null, DeleteRequest>({
      query: (body) => ({
        url: `core/user-invite/${body.id}/`,
        method: 'DELETE',
        body
      }),
      invalidatesTags: ['UserInvite']
    }),
    getCategorySetupCompletions: builder.query<CategorySetupCompletion[], void>(
      {
        query: () => ({
          url: `core/category-setup/`
        }),
        providesTags: ['CategorySetupCompletion']
      }
    ),
    createCategorySetupCompletion: builder.mutation<
      CategorySetupCompletion,
      { category: number; user: number }
    >({
      query: (body) => ({
        url: 'core/category-setup/',
        method: 'POST',
        body
      }),
      invalidatesTags: ['CategorySetupCompletion']
    }),
    getReferencesSetupCompletions: builder.query<
      ReferencesSetupCompletion[],
      void
    >({
      query: () => ({
        url: `core/references-setup/`
      }),
      providesTags: ['ReferencesSetupCompletion']
    }),
    createReferencesSetupCompletion: builder.mutation<
      ReferencesSetupCompletion,
      { user: number }
    >({
      query: (body) => ({
        url: 'core/references-setup/',
        method: 'POST',
        body
      }),
      invalidatesTags: ['ReferencesSetupCompletion']
    }),
    getEntityTypeSetupCompletions: builder.query<
      EntityTypeSetupCompletion[],
      void
    >({
      query: () => ({
        url: `core/entity-type-setup/`
      }),
      providesTags: ['EntityTypeSetupCompletion']
    }),
    createEntityTypeSetupCompletion: builder.mutation<
      EntityTypeSetupCompletion,
      { entity_type: string; user: number }
    >({
      query: (body) => ({
        url: 'core/entity-type-setup/',
        method: 'POST',
        body
      }),
      invalidatesTags: ['EntityTypeSetupCompletion']
    })
  }),
  overrideExisting: true
});

export const {
  useGetUserFullDetailsQuery,
  useGetUserDetailsQuery,
  useUpdateUserDetailsMutation,
  useSecureUpdateUserDetailsMutation,
  useFormUpdateUserDetailsMutation,
  useGetUserInvitesQuery,
  useCreateUserInviteMutation,
  useUpdateUserInviteMutation,
  useDeleteUserInviteMutation,
  useGetCategorySetupCompletionsQuery,
  useCreateCategorySetupCompletionMutation,
  useGetUserMinimalDetailsQuery,
  useLazyGetUserMinimalDetailsQuery,
  useGetUserMinimalDetailsFromIdQuery,
  useGetReferencesSetupCompletionsQuery,
  useCreateReferencesSetupCompletionMutation,
  useGetEntityTypeSetupCompletionsQuery,
  useCreateEntityTypeSetupCompletionMutation
} = userApi;

export default userApi;
