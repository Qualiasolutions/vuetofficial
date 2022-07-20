import { ListEntryResponse } from "./lists";

interface BaseEntityType {
  id: number;
  name: string;
  owner: number;
  category: number;
  resourcetype: string;
  child_entities: number[];
  [key: string]: any;
}

interface CarResponseType extends BaseEntityType {
  category: number;
  make: string;
  model: string;
  registration: string;
  MOT_due_date: string | null;
  insurance_due_date: string | null;
  service_due_date: string | null;
}

interface CarParsedType extends BaseEntityType {
  category: number;
  make: string;
  model: string;
  registration: string;
  MOT_due_date: Date | null;
  insurance_due_date: Date | null;
  service_due_date: Date | null;
}

interface ListResponseType extends BaseEntityType {
  list_entries: ListEntryResponse[]
}

const isListEntity = (x: any): x is ListResponseType => !!x.list_entries

// This should be a big OR statement of all entities
type EntityResponseType = CarResponseType | ListResponseType;
type EntityParsedType = CarParsedType | ListResponseType;

export { BaseEntityType, CarResponseType, CarParsedType, EntityResponseType, EntityParsedType, isListEntity };
