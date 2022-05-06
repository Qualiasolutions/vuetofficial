import { AuthState } from './slices/auth/types';
import { TasksState } from './slices/tasks/types';
import { CategoriesState } from './slices/categories/types';

type EntireState = {
  authentication: AuthState;
  tasks: TasksState;
  categories: CategoriesState;
};

export { EntireState };
