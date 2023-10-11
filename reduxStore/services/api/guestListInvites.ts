import { vuetApi } from './api';
import {
  CreateGuestListInviteRequest,
  GuestListInvite
} from 'types/guestListInvites';

const guestListInvitesApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    createGuestListInvite: builder.mutation<
      GuestListInvite,
      CreateGuestListInviteRequest
    >({
      query: (payload) => ({
        url: 'core/guestlist-invite/',
        method: 'POST',
        body: payload
      }),
      invalidatesTags: ['GuestListInvite']
    }),
    deleteGuestListInvite: builder.mutation<null, number>({
      query: (id) => ({
        url: `core/guestlist-invite/${id}/`,
        method: 'DELETE'
      }),
      invalidatesTags: ['GuestListInvite']
    }),
    getGuestListInvites: builder.query<GuestListInvite[], void>({
      query: () => ({
        url: 'core/guestlist-invite/',
        method: 'GET'
      }),
      providesTags: ['GuestListInvite']
    })
  }),
  overrideExisting: true
});

export const {
  useCreateGuestListInviteMutation,
  useDeleteGuestListInviteMutation,
  useGetGuestListInvitesQuery
} = guestListInvitesApi;
