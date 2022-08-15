import { vuetApi } from './api';
import { Country, AllHolidays, SelectedHolidays } from './types';

const extendedApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPeriods: builder.query<Country[], number>({
      query: () => ({
        url: 'core/period/'
      })
    }),
    createPeriod: builder.mutation ({
    query: (body) => {
      return {
        url: 'core/period/',
        method: 'POST',
        body
      };
    }
  })
  }),
  overrideExisting: true
});

export const {
    useGetAllPeriodsQuery,
    useCreatePeriodMutation
} = extendedApi;
