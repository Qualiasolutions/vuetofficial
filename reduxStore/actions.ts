// see: https://github.com/piotrwitek/typesafe-actions#reducers

import { AuthAction } from './slices/auth/reducer';
import { CalendarAction } from './slices/calendars/reducer';
import { ListsAction } from './slices/lists/reducer';
import { NotificationAction } from './slices/notifications/reducer';

export type RootAction =
  | AuthAction
  | CalendarAction
  | NotificationAction
  | ListsAction;

declare module 'typesafe-actions' {
  interface Types {
    RootAction: RootAction;
  }
}
