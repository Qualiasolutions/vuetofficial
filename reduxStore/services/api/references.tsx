import { vuetApi } from './api';
import { AllReferences, Reference } from 'types/references';
import { getCurrentDateString } from 'utils/datesAndTimes';

const normalizeReferenceData = (data: { id: number; entities: number[] }[]) => {
  return {
    ids: data.map(({ id }) => id),
    byId: data.reduce(
      (prev, next) => ({
        ...prev,
        [next.id]: next
      }),
      {}
    ),
    byEntity: data.reduce<{ [key: number]: number[] }>((prev, next) => {
      const newVal: { [key: number]: number[] } = { ...prev };
      for (const entity of next.entities) {
        newVal[entity] = newVal[entity]
          ? [...newVal[entity], next.id]
          : [next.id];
      }
      return newVal;
    }, {})
  };
};

const referencesApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReferences: builder.query<AllReferences, void>({
      query: () => ({
        url: 'core/reference/',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson = await response.json();
            return normalizeReferenceData(responseJson);
          } else {
            // Just return the error data
            return response.json();
          }
        }
      }),
      providesTags: ['Reference']
    }),
    updateReference: builder.mutation<
      Reference,
      Partial<Reference> & Pick<Reference, 'id'>
    >({
      query: (body) => {
        return {
          url: `core/reference/${body.id}/`,
          method: 'PATCH',
          body
        };
      },
      invalidatesTags: ['Reference'],
      async onQueryStarted(
        { ...patch },
        { dispatch, queryFulfilled, getState }
      ) {
        const patchResults = [];
        for (const {
          endpointName,
          originalArgs
        } of referencesApi.util.selectInvalidatedBy(getState(), [
          { type: 'Task' }
        ])) {
          if (!['getAllReferences'].includes(endpointName)) continue;
          if (endpointName === 'getAllReferences') {
            const patchResult = dispatch(
              referencesApi.util.updateQueryData(
                'getAllReferences',
                originalArgs,
                (draft) => {
                  draft.byId[patch.id] = {
                    ...draft.byId[patch.id],
                    ...patch
                  };
                }
              )
            );
            patchResults.push(patchResult);
          }
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
    createReference: builder.mutation<
      Reference,
      Omit<Reference, 'id' | 'created_at'>
    >({
      query: (body) => {
        return {
          url: 'core/reference/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['Reference'],
      async onQueryStarted(
        { ...patch },
        { dispatch, queryFulfilled, getState }
      ) {
        const patchResults = [];
        for (const {
          endpointName,
          originalArgs
        } of referencesApi.util.selectInvalidatedBy(getState(), [
          { type: 'Reference' }
        ])) {
          if (endpointName !== 'getAllReferences') continue;
          const patchResult = dispatch(
            referencesApi.util.updateQueryData(
              'getAllReferences',
              originalArgs,
              (draft) => {
                const mockId = 1e10 + Math.round(Math.random() * 1e10);
                const mockEntry = {
                  ...patch,
                  created_at: getCurrentDateString(),
                  id: mockId
                };
                draft.ids.push(mockId);
                draft.byId[mockId] = mockEntry;

                for (const entityId of patch.entities) {
                  if (!draft.byEntity[entityId]) {
                    draft.byEntity[entityId] = [];
                  }
                  draft.byEntity[entityId].push(mockId);
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
    deleteReference: builder.mutation<void, Pick<Reference, 'id'>>({
      query: (body) => {
        return {
          url: `core/reference/${body.id}/`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['Reference'],
      async onQueryStarted(
        { ...patch },
        { dispatch, queryFulfilled, getState }
      ) {
        const patchResults = [];
        for (const {
          endpointName,
          originalArgs
        } of referencesApi.util.selectInvalidatedBy(getState(), [
          { type: 'Reference' }
        ])) {
          if (endpointName !== 'getAllReferences') continue;
          const patchResult = dispatch(
            referencesApi.util.updateQueryData(
              'getAllReferences',
              originalArgs,
              (draft) => {
                draft.ids = draft.ids.filter((id) => id !== patch.id);
                delete draft.byId[patch.id];
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

export default referencesApi;

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllReferencesQuery,
  useCreateReferenceMutation,
  useUpdateReferenceMutation,
  useDeleteReferenceMutation
} = referencesApi;
