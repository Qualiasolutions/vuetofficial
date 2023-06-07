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

export const selectNewEntityIds = createSelector(
  entitiesApi.endpoints.getAllEntities.select(null as any),
  (entities) => {
    const entityData = entities?.data;
    if (!entityData) {
      return [];
    }
    const reverseSortedIds = [...entityData.ids].sort((a, b) =>
      a < b ? 1 : -1
    );
    const newIds = [];

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    for (const id of reverseSortedIds) {
      if (new Date(entityData.byId[id].created_at) > threeDaysAgo) {
        newIds.push(id);
        continue;
      }
      // If the latest ID is not new then neathir is anything older
      return newIds;
    }
    return newIds;
  }
);
