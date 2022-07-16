import { AuthState } from './slices/auth/types';
import { NotificationState } from './slices/notifications/types';
import { vuetApi } from './services/api/api';

type EntireState =
  | {
      authentication: AuthState;
      notifications: NotificationState;
      [vuetApi.reducerPath]: any; // TODO -think about this
    }
  | undefined;

export { EntireState };
