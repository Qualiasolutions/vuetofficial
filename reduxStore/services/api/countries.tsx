import { vuetApi } from './api';
import { AllCountries, AllHolidays, holiday } from './types';

const extendedApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCountries: builder.query<AllCountries[], number>({
      query: () => ({
        url: 'core/holidays/countries/'
      }),
      providesTags: ['Country']
    }),
    getHolidays: builder.query<AllHolidays, string>({
      query: (body) => ({
        url: `core/holidays/country_holidays?${body}`
      })
    }),
    saveHoliday: builder.mutation<AllHolidays, any>({
      query: (body) => ({
        url: `core/holidays/`,
        method: 'POST',
        body
      })
    }),
    getSelectedHoliday: builder.query<AllHolidays, any>({
      query: () => ({
        url: `core/holidays/`
      })
    })
  }),
  overrideExisting: true
});

export const {
  useGetAllCountriesQuery,
  useGetHolidaysQuery,
  useSaveHolidayMutation,
  useGetSelectedHolidayQuery
} = extendedApi;
