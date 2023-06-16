export type CreateReferenceRequest = {
  name: string;
  value: string;
  group: number;
  created_by: number;
};

export type Reference = {
  id: number;
  name: string;
  value: string;
  group: number;
  created_by: number;
  created_at: string;
};

export type AllReferences = {
  ids: number[];
  byId: {
    [key: number]: Reference;
  };
  byGroup: {
    [key: number]: number[];
  };
};

export type CreateReferenceGroupRequest = {
  name: string;
  entities: number[];
  created_by: number;
};

export type ReferenceGroup = {
  id: number;
  name: string;
  entities: number[];
  created_by: number;
  created_at: string;
};

export type AllReferenceGroups = {
  ids: number[];
  byId: {
    [key: number]: ReferenceGroup;
  };
  byEntity: {
    [key: number]: number[];
  };
};
