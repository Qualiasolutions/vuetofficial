import { vuetApi } from './api';
import { CreateMessageRequest, MessageResponse } from 'types/messages';

const messagesApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    createMessage: builder.mutation<MessageResponse, CreateMessageRequest>({
      query: (body) => ({
        url: 'core/message/',
        method: 'POST',
        body: body
      }),
      invalidatesTags: ['Message']
    }),
    getMessagesForTaskId: builder.query<MessageResponse[], number>({
      query: (taskId) => ({
        url: `core/message/?task=${taskId}`,
        method: 'GET'
      }),
      providesTags: ['Message']
    }),
    getMessagesForEntityId: builder.query<MessageResponse[], number>({
      query: (entityId) => ({
        url: `core/message/?entity=${entityId}`,
        method: 'GET'
      }),
      providesTags: ['Message']
    })
  }),
  overrideExisting: true
});

export const {
  useCreateMessageMutation,
  useGetMessagesForTaskIdQuery,
  useGetMessagesForEntityIdQuery
} = messagesApi;
