import { PeriodResponse } from 'types/periods';
import { normalizeData, vuetApi } from './api';
import { AllPeriods } from './types';

const extendedApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPeriods: builder.query<AllPeriods, string>({
      query: () => ({
        url: 'core/period/',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: PeriodResponse[] = await response.json();
            return normalizeData(responseJson);
          } else {
            // Just return the error data
            return response.json();
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
    getScheduledPeriods: builder.query<
      PeriodResponse[],
      { start_datetime: string; end_datetime: string }
    >({
      query: ({ start_datetime, end_datetime }) => ({
        url: `core/scheduled_period/?earliest_datetime=${start_datetime}&latest_datetime=${end_datetime}`
      }),
      providesTags: ['Period']
    })
  }),
  overrideExisting: true
});

export default extendedApi;

export const {
  useGetAllPeriodsQuery,
  useCreatePeriodMutation,
  useGetScheduledPeriodsQuery
} = extendedApi;
