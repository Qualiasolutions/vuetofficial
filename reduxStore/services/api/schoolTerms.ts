import { vuetApi } from './api';
import { AllSchoolTerms, SchoolTerm } from 'types/schoolTerms';

const normaliseSchoolTerms = (data: SchoolTerm[]) => {
  return {
    ids: data.map(({ id }) => id),
    byId: data.reduce(
      (prev, next) => ({
        ...prev,
        [next.id]: next
      }),
      {}
    ),
    bySchool: data.reduce<{ [key: number]: number[] }>(
      (prev, next) => ({
        ...prev,
        [next.school]: prev[next.school]
          ? [...prev[next.school], next.id]
          : [next.id]
      }),
      {}
    )
  };
};

const schoolTermsApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSchoolTerms: builder.query<AllSchoolTerms, void>({
      query: () => ({
        url: 'core/school-term/',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: SchoolTerm[] = await response.json();
            return normaliseSchoolTerms(responseJson);
          } else {
            // Just return the error data
            return response.json();
          }
        }
      }),
      providesTags: ['SchoolTerm']
    }),
    createSchoolTerm: builder.mutation<SchoolTerm, Omit<SchoolTerm, 'id'>>({
      query: (body) => {
        return {
          url: 'core/school-term/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['SchoolTerm']
    }),
    updateSchoolTerm: builder.mutation<
      SchoolTerm,
      Partial<SchoolTerm> & Pick<SchoolTerm, 'id'>
    >({
      query: (body) => {
        return {
          url: `core/school-term/${body.id}/`,
          method: 'PATCH',
          body
        };
      },
      invalidatesTags: ['SchoolTerm']
    }),
    deleteSchoolTerm: builder.mutation<SchoolTerm, Pick<SchoolTerm, 'id'>>({
      query: (body) => {
        return {
          url: `core/school-term/${body.id}/`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['SchoolTerm']
    })
  }),
  overrideExisting: true
});

export default schoolTermsApi;

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllSchoolTermsQuery,
  useUpdateSchoolTermMutation,
  useCreateSchoolTermMutation,
  useDeleteSchoolTermMutation
} = schoolTermsApi;
