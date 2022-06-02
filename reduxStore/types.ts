import { AuthState } from './slices/auth/types';
import { TasksState } from './slices/tasks/types';
import { CategoriesState } from './slices/categories/types';
import { EntitiesState } from './slices/entities/types';
import { FamilyState } from './slices/family/types';
import { vuetApi } from './services/api/api';

type EntireState = {
  authentication: AuthState;
  tasks: TasksState;
  categories: CategoriesState;
  entities: EntitiesState;
  family: FamilyState;
  [vuetApi.reducerPath]: any; // TODO -think about this
};

export { EntireState };
