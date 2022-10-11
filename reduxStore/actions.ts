// see: https://github.com/piotrwitek/typesafe-actions#reducers

import { AuthAction } from './slices/auth/reducer';
import { CalendarAction } from './slices/calendars/reducer';

export type RootAction = AuthAction | CalendarAction;

declare module 'typesafe-actions' {
  interface Types {
    RootAction: RootAction;
  }
}
