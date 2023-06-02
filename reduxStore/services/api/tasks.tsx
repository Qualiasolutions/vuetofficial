import { AllTasks } from './types';
import { vuetApi, normalizeData } from './api';
import {
  ScheduledTaskResponseType,
  CreateTaskRequest,
  FixedTaskResponseType,
  FixedTaskParsedType,
  CreateFlexibleFixedTaskRequest
} from 'types/tasks';
import { formatTasksPerDate } from 'utils/formatTasksAndPeriods';

const normalizeScheduledTaskData = (data: ScheduledTaskResponseType[]) => {
  return {
    ordered: data.map(({ id, recurrence_index }) => ({ id, recurrence_index })),
    byDate: formatTasksPerDate(data),
    byTaskId: data.reduce<{ [key: number]: {} }>(
      (prev, next) => ({
        ...prev,
        [next.id]: {
          ...prev[next.id],
          [next.recurrence_index === null ? -1 : next.recurrence_index]: next
        }
      }),
      {}
    )
  };
};

type AllScheduledTasks = {
  ordered: { id: number; recurrence_index: number | null }[];
  byDate: {
    [date: string]: { id: number; recurrence_index: number | null }[];
  };
  byTaskId: {
    [key: number]: {
      [key: number]: ScheduledTaskResponseType;
    };
  };
};

const tasksApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllScheduledTasks: builder.query<AllScheduledTasks, void>({
      query: () => ({
        url: `core/scheduled_task/?earliest_datetime=2020-01-01T00:00:00Z&latest_datetime=2030-01-01T00:00:00Z`,
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: ScheduledTaskResponseType[] =
              await response.json();
            return normalizeScheduledTaskData(responseJson);
          } else {
            // Just return the error data
            return response.json();
          }
        }
      }),
      providesTags: ['Task']
    }),
    getAllTasks: builder.query<AllTasks, void>({
      query: () => ({
        url: 'core/task/',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: FixedTaskResponseType[] = await response.json();
            return normalizeData(responseJson);
          } else {
            // Just return the error data
            return response.json();
          }
        }
      }),
      providesTags: ['Task']
    }),
    updateTask: builder.mutation<
      FixedTaskResponseType,
      Partial<FixedTaskParsedType> &
        Pick<FixedTaskParsedType, 'id'> & {
          start_datetime?: string;
          end_datetime?: string;
        }
    >({
      query: (body) => {
        return {
          url: `core/task/${body.id}/`,
          method: 'PATCH',
          body
        };
      },
      // invalidatesTags: ['Task'],
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
          if (!['getAllTasks', 'getAllScheduledTasks'].includes(endpointName))
            continue;
          if (endpointName === 'getAllTasks') {
            const patchResult = dispatch(
              tasksApi.util.updateQueryData(
                'getAllTasks',
                originalArgs,
                (draft) => {
                  draft.byId[patch.id] = {
                    ...draft.byId[patch.id],
                    ...patch,
                    start_datetime:
                      patch.start_datetime ||
                      draft.byId[patch.id].start_datetime,
                    end_datetime:
                      patch.end_datetime || draft.byId[patch.id].end_datetime
                  };
                }
              )
            );
            patchResults.push(patchResult);
          }
          if (endpointName === 'getAllScheduledTasks') {
            const patchResult = dispatch(
              tasksApi.util.updateQueryData(
                'getAllScheduledTasks',
                originalArgs,
                (draft) => {
                  // If the task is recurrent then don't update
                  // it's start and end times (they can't change)
                  if (!draft.byTaskId[patch.id][-1]) return;

                  // Otherwise it is a single occurrence and we
                  // may want to update the start and end times
                  const scheduledTask = draft.byTaskId[patch.id][-1];
                  draft.byTaskId[patch.id][-1] = {
                    ...scheduledTask,
                    start_datetime: scheduledTask.recurrence
                      ? scheduledTask.start_datetime
                      : patch.start_datetime || scheduledTask.start_datetime,
                    end_datetime: scheduledTask.recurrence
                      ? scheduledTask.end_datetime
                      : patch.end_datetime || scheduledTask.end_datetime
                  };
                }
              )
            );
            patchResults.push(patchResult);
          }
        }
        try {
          await queryFulfilled;
        } catch {
          for (const patchResult of patchResults) {
            patchResult.undo();
          }
        }
      }
    }),
    createTask: builder.mutation<FixedTaskResponseType, CreateTaskRequest>({
      query: (body) => {
        return {
          url: 'core/task/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['Task']
    }),
    createFlexibleFixedTask: builder.mutation<
      FixedTaskResponseType,
      CreateFlexibleFixedTaskRequest
    >({
      query: (body) => {
        return {
          url: 'core/flexible-fixed-task/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['Task']
    }),
    deleteTask: builder.mutation<
      FixedTaskResponseType,
      Pick<FixedTaskResponseType, 'id'>
    >({
      query: (body) => {
        return {
          url: `core/task/${body.id}/`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['Task']
    })
  }),
  overrideExisting: true
});

export default tasksApi;

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllTasksQuery,
  useGetAllScheduledTasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useCreateTaskMutation,
  useCreateFlexibleFixedTaskMutation
} = tasksApi;
