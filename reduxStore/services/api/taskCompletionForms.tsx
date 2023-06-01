import { vuetApi } from './api';
import tasksApi from './tasks';

type TaskCompletionFormCreateRequest = {
  resourcetype: string;
  recurrence_index: number | null;
  task: number;
};

type TaskCompletionForm = {
  recurrence_index: number | null;
  task: number;
  resourcetype: string;
  id: number;
};

export type AllTaskCompletionForms = {
  ids: number[];
  byId: {
    [key: number]: TaskCompletionForm;
  };
  byTaskId: {
    [key: number]: {
      [key: number]: TaskCompletionForm;
    };
  };
};

const normalizeCompletionForms = (
  data: { id: number; task: number; recurrence_index: number | null }[]
) => {
  return {
    ids: data.map(({ id }) => id),
    byId: data.reduce<{ [key: number]: {} }>(
      (prev, next) => ({
        ...prev,
        [next.id]: next
      }),
      {}
    ),
    byTaskId: data.reduce<{ [key: number]: {} }>(
      (prev, next) => ({
        ...prev,
        [next.task]: {
          ...prev[next.task],
          [next.recurrence_index || -1]: next
        }
      }),
      {}
    )
  };
};

const taskCompletionFormsApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    getTaskCompletionForms: builder.query<AllTaskCompletionForms, void>({
      query: () => ({
        url: 'core/task_completion_form/',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: TaskCompletionForm[] = await response.json();
            return normalizeCompletionForms(responseJson);
          } else {
            // Just return the error data
            return response.json();
          }
        }
      }),
      providesTags: ['TaskCompletionForm']
    }),
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
      invalidatesTags: ['TaskCompletionForm'],
      async onQueryStarted(
        { ...patch },
        { dispatch, queryFulfilled, getState }
      ) {
        const patchResults = [];
        for (const {
          endpointName,
          originalArgs
        } of taskCompletionFormsApi.util.selectInvalidatedBy(getState(), [
          { type: 'TaskCompletionForm' }
        ])) {
          if (endpointName !== 'getTaskCompletionForms') continue;
          const patchResult = dispatch(
            taskCompletionFormsApi.util.updateQueryData(
              'getTaskCompletionForms',
              originalArgs,
              (draft) => {
                const mockId = Math.round(Math.random() * 1e10);
                const mockEntry = {
                  ...patch,
                  id: mockId
                };
                draft.ids.push(mockId);
                draft.byId[mockId] = mockEntry;

                if (!draft.byTaskId[patch.task]) {
                  draft.byTaskId[patch.task] = {};
                }
                draft.byTaskId[patch.task][
                  patch.recurrence_index === null ? -1 : patch.recurrence_index
                ] = mockEntry;
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

export default taskCompletionFormsApi;

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useCreateTaskCompletionFormMutation,
  useGetTaskCompletionFormsQuery
} = taskCompletionFormsApi;
