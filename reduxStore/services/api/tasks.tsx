import { AllTasks } from './types';
import { vuetApi, normalizeData } from './api';
import { TaskParsedType, TaskResponseType } from 'types/tasks';

const extendedApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTasks: builder.query<AllTasks, number>({
      query: () => ({
        url: 'core/task',
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
        console.log(body);
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
        console.log(body);
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
        console.log(body);
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

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllTasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useCreateTaskMutation
} = extendedApi;
