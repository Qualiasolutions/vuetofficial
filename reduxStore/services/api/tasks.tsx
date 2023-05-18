import { AllTasks } from './types';
import { vuetApi, normalizeData } from './api';
import {
  TaskParsedType,
  TaskResponseType,
  ScheduledTaskResponseType
} from 'types/tasks';

const extendedApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllScheduledTasks: builder.query<
      ScheduledTaskResponseType[],
      { start_datetime: string; end_datetime: string; }
    >({
      query: ({ start_datetime, end_datetime }) => ({
        url: `core/scheduled_task/?earliest_datetime=${start_datetime}&latest_datetime=${end_datetime}`,
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: TaskResponseType[] = await response.json();
            return responseJson;
          } else {
            // Just return the error data
            return await response.json();
          }
        }
      }),
      providesTags: ['Task']
    }),
    getAllTasks: builder.query<AllTasks, number>({
      query: () => ({
        url: 'core/task/',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: TaskResponseType[] = await response.json();
            return normalizeData(responseJson);
          } else {
            // Just return the error data
            return await response.json();
          }
        }
      }),
      providesTags: ['Task']
    }),
    updateTask: builder.mutation<
      TaskResponseType,
      Partial<TaskParsedType> & Pick<TaskParsedType, 'id'>
    >({
      query: (body) => {
        return {
          url: `core/task/${body.id}/`,
          method: 'PATCH',
          body
        };
      },
      invalidatesTags: ['Task']
    }),
    createTask: builder.mutation<TaskResponseType, Omit<TaskParsedType, 'id'>>({
      query: (body) => {
        return {
          url: 'core/task/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['Task']
    }),
    deleteTask: builder.mutation<
      TaskResponseType,
      Pick<TaskResponseType, 'id'>
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

export default extendedApi;

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllTasksQuery,
  useGetAllScheduledTasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useCreateTaskMutation
} = extendedApi;
