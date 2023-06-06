import { createSelector } from '@reduxjs/toolkit';
import referencesApi from 'reduxStore/services/api/references';

export const selectReferencesByEntityId = (entityId: number) =>
  createSelector(
    referencesApi.endpoints.getAllReferences.select(),
    (references) => {
      const refData = references?.data;
      if (!(refData && refData.byEntity && refData.byEntity[entityId])) {
        return [];
      }
      return refData.byEntity[entityId].map((refId) => refData.byId[refId]);
    }
  );
