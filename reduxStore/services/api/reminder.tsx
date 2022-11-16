import { PeriodReminder } from 'types/periods';
import { vuetApi } from './api';

const extendedApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    updateReminder: builder.mutation<
      PeriodReminder,
      Partial<PeriodReminder> & Pick<PeriodReminder, 'id'>
    >({
      query: (body) => {
        return {
          url: `core/period-reminder/${body.id}/`,
          method: 'PATCH',
          body
        };
      },
      invalidatesTags: ['Period']
    })
  }),
  overrideExisting: true
});

export const { useUpdateReminderMutation } = extendedApi;
