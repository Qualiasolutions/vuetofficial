import { vuetApi } from './api';
import { AllCountries, holiday } from './types';

const extendedApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCountries: builder.query<AllCountries[], number>({
      query: () => ({
        url: 'core/holidays/countries'
      }),
      providesTags: ['Country']
    }),
    getHolidays: builder.query<holiday[], string>({
      query: (body) => ({
        url: `core/holidays/country_holidays?${body}`
      })
    })
  }),
  overrideExisting: true
});

export const { useGetAllCountriesQuery, useGetHolidaysQuery } = extendedApi;
