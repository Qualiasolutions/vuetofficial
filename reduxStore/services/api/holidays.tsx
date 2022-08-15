import { vuetApi } from './api';
import { Country, AllHolidays, SelectedHolidays } from './types';

const extendedApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCountries: builder.query<Country[], number>({
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
    saveHoliday: builder.mutation<SelectedHolidays, any>({
      query: (body) => ({
        url: 'core/holidays/',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Holiday']
    }),
    updateHoliday: builder.mutation<SelectedHolidays, any>({
      query: (body) => ({
        url: `core/holidays/${body.id}/`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['Holiday']
    }),
    getSelectedHoliday: builder.query<SelectedHolidays[], number>({
      query: () => ({
        url: 'core/holidays/',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: SelectedHolidays[] = await response.json();
            return responseJson.map((holidays) => ({
              ...holidays,
              country_codes: JSON.parse(
                holidays.country_codes.replace(/'/g, '"')
              ),
              holiday_ids: JSON.parse(holidays.holiday_ids.replace(/'/g, '"'))
            }));
          } else {
            // Just return the error data
            return await response.json();
          }
        }
      }),
      providesTags: ['Holiday']
    })
  }),
  overrideExisting: true
});

export const {
  useGetAllCountriesQuery,
  useGetHolidaysQuery,
  useSaveHolidayMutation,
  useUpdateHolidayMutation,
  useGetSelectedHolidayQuery
} = extendedApi;
