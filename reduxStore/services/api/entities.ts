import { AllEntities } from './types';
import {
  EntityResponseType,
  FormCreateEntityRequest,
  FormUpdateEntityRequest
} from 'types/entities';
import { vuetApi } from './api';

const normalizeEntityData = (data: { id: number; category: number }[]) => {
  return {
    ids: data.map(({ id }) => id),
    byId: data.reduce(
      (prev, next) => ({
        ...prev,
        [next.id]: next
      }),
      {}
    ),
    byCategory: data.reduce<{ [key: number]: number[] }>(
      (prev, next) => ({
        ...prev,
        [next.category]: prev[next.category]
          ? [...prev[next.category], next.id]
          : [next.id]
      }),
      {}
    )
  };
};

const entitiesApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEntities: builder.query<AllEntities, void>({
      query: () => ({
        url: 'core/readonly/entity/',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: EntityResponseType[] = await response.json();
            return normalizeEntityData(responseJson);
          } else {
            // Just return the error data
            return response.json();
          }
        }
      }),
      providesTags: ['Entity']
    }),
    getMemberEntities: builder.query<AllEntities, void>({
      query: () => ({
        url: 'core/entity/',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: EntityResponseType[] = await response.json();
            return normalizeEntityData(responseJson);
          } else {
            // Just return the error data
            return response.json();
          }
        }
      }),
      providesTags: ['Entity']
    }),
    updateEntity: builder.mutation<
      EntityResponseType,
      Partial<EntityResponseType> & Pick<EntityResponseType, 'id'>
    >({
      query: (body) => {
        return {
          url: `core/entity/${body.id}/`,
          method: 'PATCH',
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
          if (!['getAllEntities', 'getMemberEntities'].includes(endpointName))
            continue;

          const patchResult = dispatch(
            entitiesApi.util.updateQueryData(
              endpointName as 'getAllEntities' | 'getMemberEntities',
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
        try {
          await queryFulfilled;
        } catch {
          for (const patchResult of patchResults) {
            patchResult.undo();
          }
        }
      }
    }),
    createEntity: builder.mutation<
      EntityResponseType,
      Omit<EntityResponseType, 'id'>
    >({
      query: (body) => {
        return {
          url: 'core/entity/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['Entity', 'Task'],
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
          if (!['getAllEntities', 'getMemberEntities'].includes(endpointName))
            continue;
          const mockId = 1e10 + Math.round(Math.random() * 1e10);
          const mockEntry = {
            ...patch,
            id: mockId
          } as EntityResponseType;
          const patchResult = dispatch(
            entitiesApi.util.updateQueryData(
              endpointName as 'getAllEntities' | 'getMemberEntities',
              originalArgs,
              (draft) => {
                draft.ids.push(mockId);
                draft.byId[mockId] = mockEntry;
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
    formCreateEntity: builder.mutation<
      EntityResponseType,
      FormCreateEntityRequest
    >({
      query: (payload) => ({
        url: 'core/entity/',
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data;'
        },
        body: payload.formData
      }),
      invalidatesTags: ['Entity', 'Task'],
      async onQueryStarted(
        { ...patch },
        { dispatch, queryFulfilled, getState }
      ) {
        const patchResults = [];
        const mockId = 1e10 + Math.round(Math.random() * 1e10);
        const mockEntry: { [key: string]: any } = {
          id: mockId
        };
        if (patch.formData) {
          for (const [key, value] of (patch.formData as any)._parts) {
            mockEntry[key] = value;
          }
        }

        for (const {
          endpointName,
          originalArgs
        } of entitiesApi.util.selectInvalidatedBy(getState(), [
          { type: 'Entity' }
        ])) {
          if (!['getAllEntities', 'getMemberEntities'].includes(endpointName))
            continue;

          const patchResult = dispatch(
            entitiesApi.util.updateQueryData(
              endpointName as 'getAllEntities' | 'getMemberEntities',
              originalArgs,
              (draft) => {
                draft.ids.push(mockId);
                draft.byId[mockId] = mockEntry as EntityResponseType;
              }
            )
          );
          patchResults.push(patchResult);
        }
        try {
          await queryFulfilled;
        } catch (err) {
          for (const patchResult of patchResults) {
            patchResult.undo();
          }
        }
      }
    }),
    formUpdateEntity: builder.mutation<
      EntityResponseType,
      FormUpdateEntityRequest
    >({
      query: (payload) => {
        return {
          url: `core/entity/${payload.id}/`,
          method: 'PATCH',
          headers: {
            'Content-Type': 'multipart/form-data;'
          },
          body: payload.formData
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
          if (!['getAllEntities', 'getMemberEntities'].includes(endpointName))
            continue;

          const patchResult = dispatch(
            entitiesApi.util.updateQueryData(
              endpointName as 'getAllEntities' | 'getMemberEntities',
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
        try {
          await queryFulfilled;
        } catch {
          for (const patchResult of patchResults) {
            patchResult.undo();
          }
        }
      }
    }),
    deleteEntity: builder.mutation<
      EntityResponseType,
      Pick<EntityResponseType, 'id'>
    >({
      query: (body) => {
        return {
          url: `core/entity/${body.id}/`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['Entity', 'Task', 'Period']
    }),
    bulkCreateEntities: builder.mutation<
      EntityResponseType[],
      Omit<EntityResponseType, 'id'>
    >({
      query: (body) => ({
        url: 'core/entity/',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Entity', 'Task', 'Period']
    }),
    bulkDeleteEntities: builder.mutation<
      EntityResponseType[],
      Pick<EntityResponseType, 'id'>[]
    >({
      query: (body) => ({
        url: 'core/entity/',
        method: 'DELETE',
        body: { pk_ids: body.map((holiday) => holiday.id) }
      }),
      invalidatesTags: ['Entity', 'Task', 'Period']
    })
  }),
  overrideExisting: true
});

export default entitiesApi;

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllEntitiesQuery,
  useGetMemberEntitiesQuery,
  useUpdateEntityMutation,
  useDeleteEntityMutation,
  useCreateEntityMutation,
  useFormCreateEntityMutation,
  useFormUpdateEntityMutation,
  useBulkCreateEntitiesMutation,
  useBulkDeleteEntitiesMutation
} = entitiesApi;
