import { Selector } from 'react-redux';
import { EntitiesState } from './types';
import { EntireState } from '../../types';
import { createSelector } from '@reduxjs/toolkit';
import { AllEntities } from './types';
import { EntityResponseType } from 'types/entities';

export const selectEntityState = (state: EntireState): EntitiesState =>
  state.entities;

export const selectAllEntities: Selector<EntireState, AllEntities> =
  createSelector(
    selectEntityState,
    (entities: EntitiesState) => entities.allEntities
  );

export const selectEntityById = (
  entityId: number | string
): Selector<EntireState, EntityResponseType> => {
  // A bit weird - URL params are passed as strings so we need to parse as an integer
  const integerEntityId =
    typeof entityId === 'number' ? entityId : parseInt(entityId);
  return createSelector(
    selectEntityState,
    (entities: EntitiesState) => entities.allEntities.byId[integerEntityId]
  );
};
