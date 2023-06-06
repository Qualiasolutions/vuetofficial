export type CreateReferenceRequest = {
  name: string;
  value: string;
  entities: number[];
  created_by: number;
};

export type Reference = {
  id: number;
  name: string;
  value: string;
  entities: number[];
  created_by: number;
  created_at: string;
};

export type AllReferences = {
  ids: number[];
  byId: {
    [key: number]: Reference;
  };
  byEntity: {
    [key: number]: number[];
  };
};
