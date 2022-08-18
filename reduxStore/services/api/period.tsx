import { vuetApi } from './api';
import { Country, AllHolidays, SelectedHolidays, allPeriods } from './types';

const extendedApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPeriods: builder.query<Country[], number>({
      query: () => ({
        url: 'core/period/'
      })
    }),
    createPeriod: builder.mutation({
      query: (body) => {
        return {
          url: 'core/period/',
          method: 'POST',
          body
        };
      }
    }),
    getScheduledPeriods: builder.query<allPeriods[], any>({
      query: () => ({
        url: 'core/scheduled_period/'
      })
    })
  }),
  overrideExisting: true
});

export const { useGetAllPeriodsQuery, useCreatePeriodMutation, useGetScheduledPeriodsQuery } = extendedApi;
