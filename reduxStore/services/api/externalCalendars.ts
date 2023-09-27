import {
  ICalIntegration,
  ICalIntegrationCreateRequest,
  ICalIntegrationUpdateRequest
} from 'types/externalCalendars';
import { vuetApi } from './api';

const extendedApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    getICalIntegrations: builder.query<ICalIntegration[], void>({
      query: () => ({
        url: 'external-calendars/ical-integration/',
        method: 'GET'
      }),
      providesTags: ['ICalIntegration']
    }),
    createICalIntegration: builder.mutation<
      ICalIntegration,
      ICalIntegrationCreateRequest
    >({
      query: (body) => ({
        url: 'external-calendars/ical-integration/',
        method: 'POST',
        body: body
      }),
      invalidatesTags: ['ICalIntegration', 'Task']
    }),
    deleteICalIntegration: builder.mutation<void, number>({
      query: (integrationId) => ({
        url: `external-calendars/ical-integration/${integrationId}/`,
        method: 'DELETE'
      }),
      invalidatesTags: ['ICalIntegration', 'Task']
    }),
    updateICalIntegration: builder.mutation<
      ICalIntegration,
      ICalIntegrationUpdateRequest
    >({
      query: (body) => ({
        url: `external-calendars/ical-integration/${body.id}/`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['ICalIntegration']
    })
  }),
  overrideExisting: true
});

export const {
  useGetICalIntegrationsQuery,
  useCreateICalIntegrationMutation,
  useDeleteICalIntegrationMutation,
  useUpdateICalIntegrationMutation
} = extendedApi;
