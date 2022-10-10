import { normalizeData, vuetApi } from './api';
import { AllPeriods, Period } from './types';

const extendedApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPeriods: builder.query<Period[], number>({
      query: () => ({
        url: 'core/period/',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: Period[] = await response.json();
            return normalizeData(responseJson);
          } else {
            // Just return the error data
            return await response.json();
          }
        }
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
    getScheduledPeriods: builder.query<AllPeriods, number>({
      query: () => ({
        url: 'core/scheduled_period/',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: Period[] = await response.json();
            return normalizeData(responseJson);
          } else {
            // Just return the error data
            return await response.json();
          }
        }
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
