import { ListResponseType } from 'types/entities';
import { FormUpdateListEntryRequest, ListEntryResponse } from 'types/lists';
import { vuetApi } from './api';
import entitiesApi from './entities';

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
      invalidatesTags: ['Entity'],
      async onQueryStarted(
        { ...patch },
        { dispatch, queryFulfilled, getState }
      ) {
        const patchResults = [];
        for (const {
          endpointName,
          originalArgs
        } of entitiesApi.util.selectInvalidatedBy(getState(), [
          { type: 'Entity' }
        ])) {
          if (endpointName !== 'getAllEntities') continue;
          const patchResult = dispatch(
            entitiesApi.util.updateQueryData(
              'getAllEntities',
              originalArgs,
              (draft) => {
                const listsToUpdate = Object.values(draft.byId).filter(
                  (entity) => entity.id === patch.list
                );
                for (const list of listsToUpdate) {
                  list.list_entries.push({
                    ...patch,
                    id: Math.round(1000000 * Math.random() * 1e7)
                  });
                }
              }
            )
          );
          patchResults.push(patchResult);
        }
        try {
          await queryFulfilled;
        } catch {
          for (const patchResult of patchResults) {
            patchResult.undo();
          }
        }
      }
    }),
    deleteListEntry: builder.mutation<void, number>({
      query: (id) => {
        return {
          url: `core/list-entry/${id}/`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['Entity'],
      async onQueryStarted(idToDelete, { dispatch, queryFulfilled, getState }) {
        const patchResults = [];
        for (const {
          endpointName,
          originalArgs
        } of entitiesApi.util.selectInvalidatedBy(getState(), [
          { type: 'Entity' }
        ])) {
          if (endpointName !== 'getAllEntities') continue;
          const patchResult = dispatch(
            entitiesApi.util.updateQueryData(
              'getAllEntities',
              originalArgs,
              (draft) => {
                const listsToUpdate = Object.values(draft.byId).filter(
                  (entity: any) => {
                    if (entity.resourcetype !== 'List') {
                      return false;
                    }
                    const listEntryIds = entity.list_entries.map(
                      (list: any) => list.id
                    );
                    return listEntryIds.includes(idToDelete);
                  }
                );
                for (const list of listsToUpdate) {
                  list.list_entries = list.list_entries.filter(
                    (listEntry: any) => listEntry.id !== idToDelete
                  );
                }
              }
            )
          );
          patchResults.push(patchResult);
        }
        try {
          await queryFulfilled;
        } catch {
          for (const patchResult of patchResults) {
            patchResult.undo();
          }
        }
      }
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
