// see: https://github.com/piotrwitek/typesafe-actions#reducers

import { AuthAction } from './slices/auth/reducer';
import { TasksAction } from './slices/tasks/reducer';
import { CategoriesAction } from './slices/categories/reducer';

export type RootAction = AuthAction | TasksAction | CategoriesAction;

declare module 'typesafe-actions' {
  interface Types {
    RootAction: RootAction;
  }
}
