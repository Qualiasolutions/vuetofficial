// see: https://github.com/piotrwitek/typesafe-actions#reducers

import { AuthAction } from './slices/auth/reducer';
import { TasksAction } from './slices/tasks/reducer';

export type RootAction = AuthAction | TasksAction;

declare module 'typesafe-actions' {
  interface Types {
    RootAction: RootAction;
  }
}
