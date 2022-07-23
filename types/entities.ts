import { ListEntryResponse } from './lists';

export interface BaseEntityType {
  id: number;
  name: string;
  owner: number;
  category: number;
  resourcetype: string;
  child_entities: number[];
  [key: string]: any;
}

export interface CarResponseType extends BaseEntityType {
  category: number;
  make: string;
  model: string;
  registration: string;
  MOT_due_date: string | null;
  insurance_due_date: string | null;
  service_due_date: string | null;
}

export interface CarParsedType extends BaseEntityType {
  category: number;
  make: string;
  model: string;
  registration: string;
  MOT_due_date: Date | null;
  insurance_due_date: Date | null;
  service_due_date: Date | null;
}

export interface ListResponseType extends BaseEntityType {
  list_entries: ListEntryResponse[];
}

export type EntityTypeName = 'Car' | 'Birthday' | 'Event';

export const isListEntity = (x: any): x is ListResponseType => !!x.list_entries;

// This should be a big OR statement of all entities
export type EntityResponseType = CarResponseType | ListResponseType;
export type EntityParsedType = CarParsedType | ListResponseType;
