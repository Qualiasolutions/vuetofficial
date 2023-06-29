import { AllTasks } from './types';
import { vuetApi, normalizeData } from './api';
import {
  ScheduledTaskResponseType,
  FixedTaskResponseType,
  CreateFlexibleFixedTaskRequest,
  CreateFixedTaskRequest,
  CreateDueDateRequest,
  DueDateResponseType,
  TaskResourceType
} from 'types/tasks';
import { formatTasksPerDate } from 'utils/formatTasksAndPeriods';
import { getDateStringsBetween } from 'utils/datesAndTimes';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '@reduxjs/toolkit/dist/query/core/apiState';

const normalizeScheduledTaskData = (data: ScheduledTaskResponseType[]) => {
  return {
    ordered: data.map(({ id, recurrence_index, resourcetype, action_id }) => ({
      id,
      recurrence_index,
      resourcetype,
      action_id
    })),
    byDate: formatTasksPerDate(data),
    byTaskId: data
      .filter((task) => ['FixedTask', 'DueDate'].includes(task.resourcetype))
      .reduce<{ [key: number]: {} }>(
        (prev, next) => ({
          ...prev,
          [next.id]: {
            ...prev[next.id],
            [next.recurrence_index === null ? -1 : next.recurrence_index]: next
          }
        }),
        {}
      ),
    byActionId: data
      .filter((task) => task.action_id)
      .reduce<{ [key: number]: {} }>(
        (prev, next) => ({
          ...prev,
          [next.action_id as number]: next
        }),
        {}
      )
  };
};

const updateQueryDataForNewTask = (
  api: any,
  newTask: FixedTaskResponseType | DueDateResponseType,
  dispatch: ThunkDispatch<any, any, AnyAction>,
  getState: () => RootState<any, any, 'vuetApi'>
) => {
  const state = getState();
  for (const { endpointName, originalArgs } of api.util.selectInvalidatedBy(
    state,
    [{ type: 'Task' }]
  )) {
    if (!['getAllTasks', 'getAllScheduledTasks'].includes(endpointName))
      continue;
    if (endpointName === 'getAllTasks') {
      dispatch(
        api.util.updateQueryData('getAllTasks', originalArgs, (draft: any) => {
          draft.ids.push(newTask.id);
          draft.byId[newTask.id] = {
            ...newTask,
            resourcetype: newTask.resourcetype || 'FixedTask'
          };
        })
      );
    }
    if (endpointName === 'getAllScheduledTasks') {
      if (!newTask.recurrence) {
        dispatch(
          api.util.updateQueryData(
            'getAllScheduledTasks',
            originalArgs,
            (draft: any) => {
              draft.byTaskId[newTask.id] = {
                '-1': {
                  ...newTask,
                  recurrence: null,
                  recurrence_index: null,
                  alert: [], // Assume no alert - this will update when data is refetched
                  resourcetype: newTask.resourcetype || 'FixedTask'
                }
              };

              const taskDates = newTask.date
                ? [newTask.date]
                : newTask.start_datetime && newTask.end_datetime
                ? getDateStringsBetween(
                    newTask.start_datetime,
                    newTask.end_datetime
                  )
                : [];

              for (const date of taskDates) {
                if (!draft.byDate[date]) {
                  draft.byDate[date] = [];
                }
                draft.byDate[date] = [
                  ...draft.byDate[date],
                  {
                    id: newTask.id,
                    recurrence_index: null,
                    type: 'TASK',
                    action_id: null
                  }
                ];
              }

              draft.ordered.push({
                id: newTask.id,
                recurrence_index: null,
                resourcetype: newTask.resourcetype || 'FixedTask',
                action_id: null
              });
            }
          )
        );
      }
    }
  }

  // We can only make these performant updates if the task is
  // not recurrent - otherwise we simply have to wait for
  // the server response
};

type AllScheduledTasks = {
  ordered: {
    id: number;
    recurrence_index: number | null;
    resourcetype: TaskResourceType;
    action_id: number | null;
  }[];
  byDate: {
    [date: string]: {
      id: number;
      recurrence_index: number | null;
      action_id: number | null;
    }[];
  };
  byTaskId: {
    [key: number]: {
      [key: number]: ScheduledTaskResponseType;
    };
  };
  byActionId: {
    [key: number]: ScheduledTaskResponseType;
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
            const responseJson: (
              | FixedTaskResponseType
              | DueDateResponseType
            )[] = await response.json();
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
      FixedTaskResponseType | DueDateResponseType,
      Partial<FixedTaskResponseType | DueDateResponseType> &
        Pick<FixedTaskResponseType, 'id'>
    >({
      query: (body) => {
        return {
          url: `core/task/${body.id}/`,
          method: 'PATCH',
          body
        };
      },
      invalidatesTags: ['Task', 'Alert', 'ActionAlert', 'TaskAction'],
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
                      patch.end_datetime || draft.byId[patch.id].end_datetime,
                    date: patch.date || draft.byId[patch.id].date,
                    duration: patch.duration || draft.byId[patch.id].duration
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
                  // its start and end times (they can't change)
                  if (!draft.byTaskId[patch.id][-1]) return;

                  // Otherwise it is a single occurrence and we
                  // may want to update the start and end times
                  const scheduledTask = draft.byTaskId[patch.id][-1];
                  draft.byTaskId[patch.id][-1] = {
                    ...scheduledTask,
                    start_datetime:
                      patch.start_datetime || scheduledTask.start_datetime,
                    end_datetime:
                      patch.end_datetime || scheduledTask.end_datetime,
                    date: patch.date || scheduledTask.date,
                    duration: patch.duration || scheduledTask.duration
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
    createTask: builder.mutation<
      FixedTaskResponseType | DueDateResponseType,
      CreateFixedTaskRequest | CreateDueDateRequest
    >({
      query: (body) => {
        return {
          url: 'core/task/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['Task', 'Alert', 'ActionAlert', 'TaskAction'], // We leave task invalidation because recurrence requires this
      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        try {
          const { data: newTask } = await queryFulfilled;
          updateQueryDataForNewTask(tasksApi, newTask, dispatch, getState);
        } catch (err) {
          console.error(err);
        }
      }
    }),
    createTaskWithoutCacheInvalidation: builder.mutation<
      FixedTaskResponseType | DueDateResponseType,
      CreateFixedTaskRequest | CreateDueDateRequest
    >({
      query: (body) => {
        return {
          url: 'core/task/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['Alert', 'ActionAlert', 'TaskAction'],
      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        try {
          const { data: newTask } = await queryFulfilled;
          updateQueryDataForNewTask(tasksApi, newTask, dispatch, getState);
        } catch (err) {
          console.error(err);
        }
      }
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
      invalidatesTags: ['Alert', 'ActionAlert', 'TaskAction'],
      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        try {
          const { data: newTask } = await queryFulfilled;
          updateQueryDataForNewTask(tasksApi, newTask, dispatch, getState);
        } catch (err) {
          console.error(err);
        }
      }
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
      invalidatesTags: ['Task', 'Alert', 'ActionAlert', 'TaskAction']
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
  useCreateTaskWithoutCacheInvalidationMutation,
  useCreateFlexibleFixedTaskMutation
} = tasksApi;
