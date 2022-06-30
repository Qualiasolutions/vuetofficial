import { AuthState } from './slices/auth/types';
import { vuetApi } from './services/api/api';

type EntireState =
  | {
      authentication: AuthState;
      [vuetApi.reducerPath]: any; // TODO -think about this
    }
  | undefined;

export { EntireState };
