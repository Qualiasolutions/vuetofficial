interface BaseEntityType {
  id: number;
  name: string;
  owner: number;
  category: number;
  resourcetype: string;
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

// This should be a big OR statement of all entities
type EntityResponseType = CarResponseType;
type EntityParsedType = CarParsedType;

export { CarResponseType, CarParsedType, EntityResponseType, EntityParsedType };
