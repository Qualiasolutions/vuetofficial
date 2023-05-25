import { AllEntities } from './types';
import {
  EntityResponseType,
  FormCreateEntityRequest,
  FormUpdateEntityRequest
} from 'types/entities';
import { vuetApi, normalizeData } from './api';

const extendedApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEntities: builder.query<AllEntities, number>({
      query: () => ({
        url: 'core/readonly/entity/',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: EntityResponseType[] = await response.json();
            return normalizeData(responseJson);
          } else {
            // Just return the error data
            return response.json();
          }
        }
      }),
      providesTags: ['Entity']
    }),
    getMemberEntities: builder.query<AllEntities, number>({
      query: () => ({
        url: 'core/entity/',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: EntityResponseType[] = await response.json();
            return normalizeData(responseJson);
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
      invalidatesTags: ['Entity', 'Task', 'Period']
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
      invalidatesTags: ['Entity', 'Task', 'Period']
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
      invalidatesTags: ['Entity', 'Task', 'Period']
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
      invalidatesTags: ['Entity', 'Task', 'Period']
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

export default extendedApi;

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
} = extendedApi;
