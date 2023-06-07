import { vuetApi, normalizeData } from './api';
import { Alert, AllAlerts } from 'types/alerts';

export const normalizeAlerts = (data: { id: number; task: number }[]) => {
  return {
    ids: data.map(({ id }) => id),
    byId: data.reduce(
      (prev, next) => ({
        ...prev,
        [next.id]: next
      }),
      {}
    ),
    byTask: data.reduce<{ [key: number]: number[] }>((prev, next) => {
      if (prev[next.task]) {
        return {
          ...prev,
          [next.task]: [...prev[next.task], next.id]
        };
      }
      return {
        ...prev,
        [next.task]: [next.id]
      };
    }, {})
  };
};

const alertsApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAlerts: builder.query<AllAlerts, void>({
      query: () => ({
        url: 'core/alert/',
        responseHandler: async (response) => {
          if (response.ok) {
            const responseJson: Alert[] = await response.json();
            return normalizeAlerts(responseJson);
          } else {
            // Just return the error data
            return response.json();
          }
        }
      }),
      providesTags: ['Alert']
    }),
    deleteAlert: builder.mutation<void, Pick<Alert, 'id'>>({
      query: (body) => {
        return {
          url: `core/alert/${body.id}/`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['Alert']
    })
  }),
  overrideExisting: true
});

export default alertsApi;

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAllAlertsQuery, useDeleteAlertMutation } = alertsApi;
