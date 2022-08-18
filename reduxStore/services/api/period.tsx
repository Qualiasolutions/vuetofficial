import { vuetApi } from './api';
import { Country, AllHolidays, SelectedHolidays, AllPeriods } from './types';

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
    getScheduledPeriods: builder.query<AllPeriods[], any>({
      query: () => ({
        url: 'core/scheduled_period/'
      })
    })
  }),
  overrideExisting: true
});

export const { useGetAllPeriodsQuery, useCreatePeriodMutation, useGetScheduledPeriodsQuery } = extendedApi;
