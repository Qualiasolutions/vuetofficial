import { vuetApi } from './api';
import {
  AllSchoolBreaks,
  AllSchoolYears,
  SchoolBreak,
  SchoolYear
} from 'types/schoolTerms';

const normaliseSchoolYears = (data: SchoolYear[]) => {
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

const normaliseSchoolBreaks = (data: SchoolBreak[]) => {
  return {
    ids: data.map(({ id }) => id),
    byId: data.reduce(
      (prev, next) => ({
        ...prev,
        [next.id]: next
      }),
      {}
    ),
    byYear: data.reduce<{ [key: number]: number[] }>(
      (prev, next) => ({
        ...prev,
        [next.school_year]: prev[next.school_year]
          ? [...prev[next.school_year], next.id]
          : [next.id]
      }),
      {}
    )
  };
};

const schoolTermsApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSchoolYears: builder.query<AllSchoolYears, void>({
      query: () => ({
        url: 'core/school-year/',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: SchoolYear[] = await response.json();
            return normaliseSchoolYears(responseJson);
          } else {
            // Just return the error data
            return response.json();
          }
        }
      }),
      providesTags: ['SchoolYear']
    }),
    createSchoolYear: builder.mutation<SchoolYear, Omit<SchoolYear, 'id'>>({
      query: (body) => {
        return {
          url: 'core/school-year/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['SchoolYear']
    }),
    updateSchoolYear: builder.mutation<
      SchoolYear,
      Partial<SchoolYear> & Pick<SchoolYear, 'id'>
    >({
      query: (body) => {
        return {
          url: `core/school-year/${body.id}/`,
          method: 'PATCH',
          body
        };
      },
      invalidatesTags: ['SchoolYear']
    }),
    deleteSchoolYear: builder.mutation<SchoolYear, Pick<SchoolYear, 'id'>>({
      query: (body) => {
        return {
          url: `core/school-year/${body.id}/`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['SchoolYear']
    }),
    getAllSchoolBreaks: builder.query<AllSchoolBreaks, void>({
      query: () => ({
        url: 'core/school-break/',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: SchoolBreak[] = await response.json();
            return normaliseSchoolBreaks(responseJson);
          } else {
            // Just return the error data
            return response.json();
          }
        }
      }),
      providesTags: ['SchoolBreak']
    }),
    createSchoolBreak: builder.mutation<SchoolBreak, Omit<SchoolBreak, 'id'>>({
      query: (body) => {
        return {
          url: 'core/school-break/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['SchoolBreak']
    }),
    updateSchoolBreak: builder.mutation<
      SchoolBreak,
      Partial<SchoolBreak> & Pick<SchoolBreak, 'id'>
    >({
      query: (body) => {
        return {
          url: `core/school-break/${body.id}/`,
          method: 'PATCH',
          body
        };
      },
      invalidatesTags: ['SchoolBreak']
    }),
    deleteSchoolBreak: builder.mutation<SchoolBreak, Pick<SchoolBreak, 'id'>>({
      query: (body) => {
        return {
          url: `core/school-break/${body.id}/`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['SchoolBreak']
    })
  }),
  overrideExisting: true
});

export default schoolTermsApi;

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllSchoolYearsQuery,
  useUpdateSchoolYearMutation,
  useCreateSchoolYearMutation,
  useDeleteSchoolYearMutation,
  useGetAllSchoolBreaksQuery,
  useUpdateSchoolBreakMutation,
  useCreateSchoolBreakMutation,
  useDeleteSchoolBreakMutation
} = schoolTermsApi;
