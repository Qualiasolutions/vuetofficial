import { EntityResponseType } from 'types/entities';

type AllEntities = {
  ids: number[];
  byId: {
    [id: number]: EntityResponseType;
  };
};

type EntitiesState = {
  allEntities: AllEntities;
};

export { AllEntities, EntitiesState };
