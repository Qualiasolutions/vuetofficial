import { BaseEntityType } from './entities';

export type ListEntryResponse = {
  id: number;
  list: number;
  title: string;
  selected: boolean;
  image: string;
  notes: string;
  phone_number: string;
  image_200_200: string;
  presigned_image_url: string;
};

export type ListEntryCreateRequest = {
  list: number;
  title?: string;
  selected?: boolean;
  image?: string;
  notes?: string;
  phone_number?: string;
};

export type ListEntryUpdateRequest = {
  id: number;
  list?: number;
  title?: string;
  selected?: boolean;
  image?: string;
  notes?: string;
  phone_number?: string;
};

export type FormUpdateListEntryRequest = {
  id: number;
  formData?: FormData;
};

export type PlanningList = {
  id: number;
  category: number;
  name: string;
  members: number[];
};

export type AllPlanningLists = {
  ids: number[];
  byId: {
    [key: number]: PlanningList;
  };
  byCategory: {
    [key: number]: number[];
  };
};

export type PlanningSublist = {
  id: number;
  list: number;
  title: string;
};

export type AllPlanningSublists = {
  ids: number[];
  byId: {
    [key: number]: PlanningSublist;
  };
  byList: {
    [key: number]: number[];
  };
};

export type PlanningListItem = {
  id: number;
  sublist: number;
  title: string;
  checked: boolean;
};

export type AllPlanningListItems = {
  ids: number[];
  byId: {
    [key: number]: PlanningListItem;
  };
  bySublist: {
    [key: number]: number[];
  };
};
