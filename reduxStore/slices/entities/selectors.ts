import { createSelector } from '@reduxjs/toolkit';
import entitiesApi from 'reduxStore/services/api/entities';

export const selectEntityById = (entityId: number) =>
  createSelector(
    entitiesApi.endpoints.getAllEntities.select(null as any),
    (entities) => {
      const entityData = entities?.data;
      if (!entityData) {
        return null;
      }
      return entityData.byId[entityId];
    }
  );
