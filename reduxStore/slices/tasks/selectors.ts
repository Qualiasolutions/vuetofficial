import { Selector } from 'react-redux';
import { TasksState } from './types';
import { EntireState } from '../../types';
import { createSelector } from '@reduxjs/toolkit';
import { AllTasks } from './types';

export const selectAuthState = (state: EntireState): TasksState => state.tasks;

export const selectAllTasks: Selector<EntireState, AllTasks> = createSelector(
  selectAuthState,
  (auth: TasksState) => auth.allTasks
);
