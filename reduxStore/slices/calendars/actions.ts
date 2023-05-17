import { createAction } from 'typesafe-actions';

export const setSelectedPeriodId = createAction(
  '@calendars/setSelectedPeriodId'
)<{ periodId: number; recurrenceIndex: number }>();

export const setSelectedReminderId = createAction(
  '@calendars/setSelectedReminderId'
)<{ reminderId: number }>();

export const setListEnforcedDate = createAction(
  '@calendars/setListEnforcedDate'
)<{ date: string }>();

export const setMonthEnforcedDate = createAction(
  '@calendars/setMonthEnforcedDate'
)<{ date: string }>();

export const deselectTasks = createAction('@calendars/deselectTasks')();
