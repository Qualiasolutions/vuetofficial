import { vuetApi, normalizeData } from './api';
import {
  AllFamilyCategoryViewPermission,
  AllPreferredDays,
  FamilyCategoryViewPermission,
  PreferredDays
} from 'types/settings';

const extendedApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFamilyCategoryViewPermissions: builder.query<
      AllFamilyCategoryViewPermission,
      void
    >({
      query: () => ({
        url: 'core/family-category-view-permissions/',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: FamilyCategoryViewPermission[] =
              await response.json();
            return normalizeData(responseJson);
          } else {
            // Just return the error data
            return response.json();
          }
        }
      }),
      providesTags: ['FamilyCategoryViewPermission']
    }),
    updateFamilyCategoryViewPermission: builder.mutation<
      FamilyCategoryViewPermission,
      Partial<FamilyCategoryViewPermission> &
        Pick<FamilyCategoryViewPermission, 'id'>
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

    getAllPreferredDays: builder.query<AllPreferredDays, void>({
      query: () => ({
        url: 'core/preferred-days/',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: PreferredDays[] = await response.json();
            return normalizeData(responseJson);
          } else {
            // Just return the error data
            return response.json();
          }
        }
      }),
      providesTags: ['PreferredDays']
    }),
    updatePreferredDays: builder.mutation<
      PreferredDays,
      Partial<PreferredDays> & Pick<PreferredDays, 'id'>
    >({
      query: (body) => {
        return {
          url: `core/preferred-days/${body.id}/`,
          method: 'PATCH',
          body
        };
      },
      invalidatesTags: ['PreferredDays']
    }),
    createPreferredDays: builder.mutation<
      PreferredDays,
      Omit<PreferredDays, 'id'>
    >({
      query: (body) => {
        return {
          url: 'core/preferred-days/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['PreferredDays']
    }),
    deletePreferredDays: builder.mutation<
      PreferredDays,
      Pick<PreferredDays, 'id'>
    >({
      query: (body) => {
        return {
          url: `core/preferred-days/${body.id}/`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['PreferredDays']
    })
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
  useCreateFamilyCategoryViewPermissionMutation,
  useGetAllPreferredDaysQuery,
  useUpdatePreferredDaysMutation,
  useCreatePreferredDaysMutation,
  useDeletePreferredDaysMutation
} = extendedApi;
