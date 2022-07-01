import { AllEntities } from './types';
import { EntityResponseType } from 'types/entities';
import { vuetApi, normalizeData } from './api';

const extendedApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEntities: builder.query<AllEntities, number>({
      query: () => ({
        url: 'core/entity',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: EntityResponseType[] = await response.json();
            return normalizeData(responseJson);
          } else {
            // Just return the error data
            return await response.json();
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
      invalidatesTags: ['Entity', 'Task']
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
      invalidatesTags: ['Entity', 'Task']
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
      invalidatesTags: ['Entity', 'Task']
    })
  }),
  overrideExisting: true
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllEntitiesQuery,
  useUpdateEntityMutation,
  useDeleteEntityMutation,
  useCreateEntityMutation
} = extendedApi;
