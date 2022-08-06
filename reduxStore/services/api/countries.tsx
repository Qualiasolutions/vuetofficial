import { vuetApi } from './api';
import { AllCountries } from './types';

const extendedApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCountries: builder.query<AllCountries[], number>({
      query: () => ({
        url: 'core/holidays/countries'
      })
    })
  }),
  overrideExisting: true
});

export const { useGetAllCountriesQuery } = extendedApi;
