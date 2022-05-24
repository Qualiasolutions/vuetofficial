// see: https://github.com/piotrwitek/typesafe-actions#reducers

import { AuthAction } from './slices/auth/reducer';
import { TasksAction } from './slices/tasks/reducer';
import { CategoriesAction } from './slices/categories/reducer';
import { EntitiesAction } from './slices/entities/reducer';
import { FamilyAction } from './slices/family/reducer';

export type RootAction =
  | AuthAction
  | TasksAction
  | CategoriesAction
  | EntitiesAction
  | FamilyAction;

declare module 'typesafe-actions' {
  interface Types {
    RootAction: RootAction;
  }
}
