import { Selector } from 'react-redux';
import { EntitiesState } from './types';
import { EntireState } from '../../types';
import { createSelector } from '@reduxjs/toolkit';
import { AllEntities } from './types';
import { EntityResponseType } from 'types/entities';

export const selectEntityState = (state: EntireState): EntitiesState =>
  state.entities;

export const selectAllEntities: Selector<EntireState, AllEntities> =
  createSelector(selectEntityState, (entities: EntitiesState) => entities.allEntities);

export const selectEntityById = (entityId: number): Selector<EntireState, EntityResponseType> => {
  return createSelector(
    selectEntityState,
    (entities: EntitiesState) => entities.allEntities.byId[entityId]
  );
}
