import { Selector } from 'react-redux';
import { TasksState } from './types';
import { EntireState } from '../../types';
import { createSelector } from '@reduxjs/toolkit';
import { AllTasks } from './types';
import { TaskResponseType } from 'types/tasks';

export const selectTaskState = (state: EntireState): TasksState => state.tasks;

export const selectAllTasks: Selector<EntireState, AllTasks> = createSelector(
  selectTaskState,
  (tasks: TasksState) => tasks.allTasks
);

export const selectTasksByEntityId = (entityId: number): Selector<EntireState, TaskResponseType[]> => {
  return createSelector(
    selectTaskState,
    (tasks: TasksState) => Object.values(tasks.allTasks.byId).filter(task => task.entity === entityId)
  );
}