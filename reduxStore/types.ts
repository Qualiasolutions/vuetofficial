import { AuthState } from './slices/auth/types';
import { TasksState } from './slices/tasks/types';

type EntireState = {
  authentication: AuthState;
  tasks: TasksState;
};

export { EntireState };
