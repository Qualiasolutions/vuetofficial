import { AllCategories } from './types';
import {
  AllProfessionalCategories,
  Category,
  ProfessionalCategory
} from 'types/categories';
import { normalizeData, vuetApi } from './api';

const normalizeCategoryData = (data: { id: number; name: string }[]) => {
  return {
    ids: data.map(({ id }) => id),
    byId: data.reduce(
      (prev, next) => ({
        ...prev,
        [next.id]: next
      }),
      {}
    ),
    byName: data.reduce(
      (prev, next) => ({
        ...prev,
        [next.name]: next
      }),
      {}
    )
  };
};

const categoriesApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query<AllCategories, void>({
      query: () => ({
        url: 'core/category/',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: Category[] = await response.json();
            return normalizeCategoryData(responseJson);
          } else {
            // Just return the error data
            return response.json();
          }
        }
      }),
      providesTags: ['Category']
    }),
    getAllProfessionalCategories: builder.query<
      AllProfessionalCategories,
      void
    >({
      query: () => ({
        url: 'core/professional-category/',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: Category[] = await response.json();
            return normalizeData(responseJson);
          } else {
            // Just return the error data
            return response.json();
          }
        }
      }),
      providesTags: ['ProfessionalCategory']
    }),
    createProfessionalCategory: builder.mutation<
      ProfessionalCategory,
      Omit<ProfessionalCategory, 'id'>
    >({
      query: (body) => ({
        url: 'core/professional-category/',
        method: 'POST',
        body
      }),
      invalidatesTags: ['ProfessionalCategory']
    })
  }),
  overrideExisting: true
});

export default categoriesApi;

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllCategoriesQuery,
  useGetAllProfessionalCategoriesQuery,
  useCreateProfessionalCategoryMutation
} = categoriesApi;
