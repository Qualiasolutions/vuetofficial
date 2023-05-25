import { vuetApi, normalizeData } from './api';
import { AllFamilyCategoryViewPermission, FamilyCategoryViewPermission } from 'types/settings';

const extendedApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFamilyCategoryViewPermissions: builder.query<AllFamilyCategoryViewPermission, void>({
      query: () => ({
        url: 'core/family-category-view-permissions/',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: FamilyCategoryViewPermission[] = await response.json();
            return normalizeData(responseJson);
          } else {
            // Just return the error data
            return await response.json();
          }
        }
      }),
      providesTags: ['FamilyCategoryViewPermission']
    }),
    updateFamilyCategoryViewPermission: builder.mutation<
      FamilyCategoryViewPermission,
      Partial<FamilyCategoryViewPermission> & Pick<FamilyCategoryViewPermission, 'id'>
    >({
      query: (body) => {
        return {
          url: `core/family-category-view-permissions/${body.id}/`,
          method: 'PATCH',
          body
        };
      },
      invalidatesTags: ['FamilyCategoryViewPermission']
    }),
    createFamilyCategoryViewPermission: builder.mutation<
      FamilyCategoryViewPermission,
      Omit<FamilyCategoryViewPermission, 'id'>
    >({
      query: (body) => {
        return {
          url: 'core/family-category-view-permissions/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['FamilyCategoryViewPermission']
    }),
    deleteFamilyCategoryViewPermission: builder.mutation<
      FamilyCategoryViewPermission,
      Pick<FamilyCategoryViewPermission, 'id'>
    >({
      query: (body) => {
        return {
          url: `core/family-category-view-permissions/${body.id}/`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['FamilyCategoryViewPermission']
    }),
  }),
  overrideExisting: true
});

export default extendedApi;

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllFamilyCategoryViewPermissionsQuery,
  useUpdateFamilyCategoryViewPermissionMutation,
  useDeleteFamilyCategoryViewPermissionMutation,
  useCreateFamilyCategoryViewPermissionMutation
} = extendedApi;
