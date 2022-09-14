import { vuetApi } from './api';
import { Country, Period } from './types';

const extendedApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPeriods: builder.query<Country[], number>({
      query: () => ({
        url: 'core/period/'
      }),
      providesTags: ['Period']
    }),
    createPeriod: builder.mutation({
      query: (body) => {
        return {
          url: 'core/period/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['Period']
    }),
    getScheduledPeriods: builder.query<Period[], number>({
      query: () => ({
        url: 'core/scheduled_period/'
      }),
      providesTags: ['Period']
    })
  }),
  overrideExisting: true
});

export const {
  useGetAllPeriodsQuery,
  useCreatePeriodMutation,
  useGetScheduledPeriodsQuery
} = extendedApi;
