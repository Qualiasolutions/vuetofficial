import { vuetApi } from './api';
import tasksApi from './tasks';

type TaskCompletionFormCreateRequest = {
  resourcetype: string;
  recurrence_index?: number | null;
  task: number;
};

const extendedApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    createTaskCompletionForm: builder.mutation<
      object,
      TaskCompletionFormCreateRequest
    >({
      query: (body) => {
        return {
          url: 'core/task_completion_form/',
          method: 'POST',
          body
        };
      },
      // invalidatesTags: ['TaskCompletionForm', 'Task'],
      async onQueryStarted(
        { ...patch },
        { dispatch, queryFulfilled, getState }
      ) {
        const patchResults = [];
        for (const {
          endpointName,
          originalArgs
        } of tasksApi.util.selectInvalidatedBy(getState(), [
          { type: 'Task' }
        ])) {
          if (endpointName !== 'getAllScheduledTasks') continue;
          const patchResult = dispatch(
            tasksApi.util.updateQueryData(
              'getAllScheduledTasks',
              originalArgs,
              (draft) => {
                let tasksToUpdate = draft.filter(
                  (task) => task.id === patch.task
                );
                if ((patch.recurrence_index !== null) && (patch.recurrence_index !== undefined)) {
                  tasksToUpdate = tasksToUpdate.filter(
                    (task) =>
                      task.recurrence &&
                      task.recurrence_index === patch.recurrence_index
                  );
                }
                for (const task of tasksToUpdate) {
                  Object.assign(task, { is_complete: true });
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

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useCreateTaskCompletionFormMutation } = extendedApi;
