import { vuetApi } from './api';

const extendedApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    createTaskCompletionForm: builder.mutation<
      object,
      object
    >({
      query: (body) => {
        console.log(body);
        return {
          url: 'core/task_completion_form/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['TaskCompletionForm', 'Task']
    }),
  }),
  overrideExisting: true
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useCreateTaskCompletionFormMutation
} = extendedApi;
