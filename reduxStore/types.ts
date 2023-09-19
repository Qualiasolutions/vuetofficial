import { AuthState } from './slices/auth/types';
import { NotificationState } from './slices/notifications/types';
import { vuetApi } from './services/api/api';
import { CalendarState } from './slices/calendars/types';
import { ListsState } from './slices/lists/types';
import { MiscState } from './slices/misc/types';

type EntireState =
  | {
      authentication: AuthState;
      notifications: NotificationState;
      calendar: CalendarState;
      misc: MiscState;
      lists: ListsState;
      [vuetApi.reducerPath]: any; // TODO -think about this
    }
  | undefined;

export { EntireState };
