import { PeriodReminder } from 'types/periods';
import { vuetApi } from './api';
import periodsApi from './period';

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
      invalidatesTags: ['Period'],
      async onQueryStarted(
        { ...patch },
        { dispatch, queryFulfilled, getState }
      ) {
        const patchResults = [];
        for (const {
          endpointName,
          originalArgs
        } of periodsApi.util.selectInvalidatedBy(getState(), [
          { type: 'Period' }
        ])) {
          if (endpointName !== 'getScheduledPeriods') continue;
          const patchResult = dispatch(
            periodsApi.util.updateQueryData(
              'getScheduledPeriods',
              originalArgs,
              (draft) => {
                let periodsToUpdate = draft.filter((period) =>
                  period.reminders.map((r) => r.id).includes(patch.id)
                );
                for (const period of periodsToUpdate) {
                  const remindersToUpdate = period.reminders.filter(
                    (r) => r.id === patch.id
                  );
                  for (const reminder of remindersToUpdate) {
                    Object.assign(reminder, patch);
                  }
                }
              }
            )
          );
          patchResults.push(patchResult);
        }
        try {
          await queryFulfilled;
        } catch {
          for (const patchResult of patchResults) {
            patchResult.undo();
          }
        }
      }
    })
  }),
  overrideExisting: true
});

export const { useUpdateReminderMutation } = extendedApi;
