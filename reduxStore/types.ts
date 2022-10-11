import { AuthState } from './slices/auth/types';
import { NotificationState } from './slices/notifications/types';
import { vuetApi } from './services/api/api';
import { CalendarState } from './slices/calendars/types';

type EntireState =
  | {
      authentication: AuthState;
      notifications: NotificationState;
      calendar: CalendarState;
      [vuetApi.reducerPath]: any; // TODO -think about this
    }
  | undefined;

export { EntireState };
