import { ListEntryResponse } from './lists';

export type EntityTypeName =
  | 'Anniversary'
  | 'AnniversaryPlan'
  | 'Car'
  | 'CareerGoal'
  | 'Clothing'
  | 'Boat'
  | 'Birthday'
  | 'Event'
  | 'EventSubentity'
  | 'Hobby'
  | 'Home'
  | 'Garden'
  | 'FoodPlan'
  | 'LaundryPlan'
  | 'PublicTransport'
  | 'SocialMedia'
  | 'SocialPlan'
  | 'List'
  | 'Holiday'
  | 'HolidayPlan'
  | 'Trip'
  | 'TravelPlan'
  | 'Flight'
  | 'Food'
  | 'TrainBusFerry'
  | 'RentalCar'
  | 'TaxiOrTransfer'
  | 'DriveTime'
  | 'HotelOrRental'
  | 'StayWithFriend'
  | 'TripActivity'
  | 'Pet'
  | 'DaysOff'
  | 'AcademicPlan'
  | 'ExtracurricularPlan'
  | 'School'
  | 'SchoolBreak'
  | 'HealthBeauty'
  | 'HealthGoal'
  | 'Patient'
  | 'Appointment'
  | 'Student'
  | 'Employee'
  | 'Finance';

export type SchoolTermTypeName =
  | 'SchoolTerm'
  | 'SchoolTermStart'
  | 'SchoolTermEnd'
  | 'SchoolBreak'
  | 'SchoolYearStart'
  | 'SchoolYearEnd';

export interface BaseEntityType {
  id: number;
  name: string;
  category: number;
  created_at: string;
  resourcetype: EntityTypeName;
  hidden: boolean;
  child_entities: number[];
  members: number[];
  parent_name: string | null;
  [key: string]: any;
}

export interface CarResponseType extends BaseEntityType {
  category: number;
  make: string;
  model: string;
  registration: string;
  mot_due_date: string | null;
  insurance_due_date: string | null;
  service_due_date: string | null;
}

export interface CarParsedType extends BaseEntityType {
  category: number;
  make: string;
  model: string;
  registration: string;
  mot_due_date: Date | null;
  insurance_due_date: Date | null;
  service_due_date: Date | null;
}

export interface ListResponseType extends BaseEntityType {
  list_entries: ListEntryResponse[];
}

export interface HolidayResponseType extends BaseEntityType {
  start_date: string;
  end_date: string;
  string_id: string;
  country_code: string;
}

export interface StudentResponseType extends BaseEntityType {
  school_attended: number;
}

export type FormCreateEntityRequest = {
  formData?: FormData;
};

export type FormUpdateEntityRequest = {
  id: number;
  formData?: FormData;
};

export const isListEntity = (x: any): x is ListResponseType => !!x.list_entries;
export const isStudentEntity = (x: any): x is StudentResponseType =>
  !!x.school_attended;

// This should be a big OR statement of all entities
export type EntityResponseType =
  | CarResponseType
  | ListResponseType
  | HolidayResponseType;
export type EntityParsedType =
  | CarParsedType
  | ListResponseType
  | StudentResponseType
  | HolidayResponseType;
