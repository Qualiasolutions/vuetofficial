import { Selector } from 'react-redux';
import { EntitiesState } from './types';
import { EntireState } from '../../types';
import { createSelector } from '@reduxjs/toolkit';
import { AllEntities } from './types';

export const selectAuthState = (state: EntireState): EntitiesState =>
  state.entities;

export const selectAllEntities: Selector<EntireState, AllEntities> =
  createSelector(selectAuthState, (auth: EntitiesState) => auth.allEntities);
