import { AuthState } from './slices/auth/types';
import { TasksState } from './slices/tasks/types';
import { CategoriesState } from './slices/categories/types';
import { EntitiesState } from './slices/entities/types';
import { FamilyState } from './slices/family/types';

type EntireState = {
  authentication: AuthState;
  tasks: TasksState;
  categories: CategoriesState;
  entities: EntitiesState;
  family: FamilyState;
};

export { EntireState };
