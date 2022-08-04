import { FormUpdateListEntryRequest, ListEntryResponse } from 'types/lists';
import { vuetApi } from './api';

const extendedApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    updateListEntry: builder.mutation<
      ListEntryResponse,
      Partial<ListEntryResponse> & Pick<ListEntryResponse, 'id'>
    >({
      query: (body) => {
        return {
          url: `core/list-entry/${body.id}/`,
          method: 'PATCH',
          body
        };
      },
      invalidatesTags: ['Entity']
    }),
    formUpdateListEntry: builder.mutation<
      ListEntryResponse,
      FormUpdateListEntryRequest
    >({
      query: (payload) => ({
        url: `core/list-entry/${payload.id}/`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'multipart/form-data;'
        },
        body: payload.formData
      }),
      invalidatesTags: ['Entity']
    }),
    createListEntry: builder.mutation<
      ListEntryResponse,
      Partial<Omit<ListEntryResponse, 'id'>>
    >({
      query: (body) => {
        return {
          url: 'core/list-entry/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['Entity']
    }),
    deleteListEntry: builder.mutation<void, number>({
      query: (id) => {
        return {
          url: `core/list-entry/${id}/`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['Entity']
    })
  }),
  overrideExisting: true
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useUpdateListEntryMutation,
  useCreateListEntryMutation,
  useDeleteListEntryMutation,
  useFormUpdateListEntryMutation
} = extendedApi;
