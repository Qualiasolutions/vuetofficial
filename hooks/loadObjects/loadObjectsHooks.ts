import { makeLoadObjects } from './makeLoadObjectsHook';
import { setAllCategories } from 'reduxStore/slices/categories/actions';
import { Category as CategoryType } from 'types/categories';
import { setAllTasks } from 'reduxStore/slices/tasks/actions';
import { TaskResponseType } from 'types/tasks';
import { setAllEntities } from 'reduxStore/slices/entities/actions';
import { EntityResponseType } from 'types/entities';
import { setFamily } from 'reduxStore/slices/family/actions';
import { FamilyResponseType } from 'types/families';

export const loadAllCategories = makeLoadObjects<CategoryType>(
  '/core/category/',
  setAllCategories
);
export const loadAllTasks = makeLoadObjects<TaskResponseType>(
  '/core/task/',
  setAllTasks
);
export const loadAllEntities = makeLoadObjects<EntityResponseType>(
  '/core/entity/',
  setAllEntities
);
export const loadFamily = makeLoadObjects<FamilyResponseType>(
  '/core/family/',
  setFamily
);
