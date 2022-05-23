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

export const selectTasksByEntityId = (entityId: (number | string)): Selector<EntireState, TaskResponseType[]> => {
  // A bit weird - URL params are passed as strings so we need to parse as an integer
  const integerEntityId = (typeof entityId === 'number') ? entityId : parseInt(entityId)
  return createSelector(
    selectTaskState,
    (tasks: TasksState) => Object.values(tasks.allTasks.byId).filter(task => task.entity === integerEntityId)
  );
}