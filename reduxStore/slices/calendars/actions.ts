import { createAction } from 'typesafe-actions';

export const setSelectedTaskId = createAction('@calendars/setSelectedTaskId')<{
  taskId: number;
  recurrenceIndex: number;
}>();

export const setSelectedPeriodId = createAction(
  '@calendars/setSelectedPeriodId'
)<{ periodId: number; recurrenceIndex: number }>();

export const setSelectedReminderId = createAction(
  '@calendars/setSelectedReminderId'
)<{ reminderId: number }>();

export const deselectTasks = createAction('@calendars/deselectTasks')();
