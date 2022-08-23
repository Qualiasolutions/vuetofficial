import { ListEntryResponse } from './lists';

export type EntityTypeName =
  | 'Car'
  | 'Birthday'
  | 'Event'
  | 'Hobby'
  | 'List'
  | 'Holiday'
  | 'DaysOff';

export interface BaseEntityType {
  id: number;
  name: string;
  owner: number;
  category: number;
  resourcetype: EntityTypeName;
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

export interface TripAccommodationResponseType extends BaseEntityType {
  transport_type: string;
  flight_number: string | null;
  start_datetime: string | null;
  end_datetime: string | null;
}

export interface HolidayResponseType extends BaseEntityType {
  start_date: string;
  end_date: string;
  string_id: string;
  country_code: string;
}

export type FormCreateEntityRequest = {
  formData?: FormData;
};

export type FormUpdateEntityRequest = {
  id: number;
  formData?: FormData;
};

export const isListEntity = (x: any): x is ListResponseType => !!x.list_entries;

// This should be a big OR statement of all entities
export type EntityResponseType =
  | CarResponseType
  | ListResponseType
  | HolidayResponseType;
export type EntityParsedType =
  | CarParsedType
  | ListResponseType
  | HolidayResponseType;
