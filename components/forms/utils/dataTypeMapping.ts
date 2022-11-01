import { FormDataType } from '../RTKForm';

export const dataTypeMapping = {
  Pet: 'form',
  Car: 'form',
  Boat: 'form',
  Home: 'form',
  Trip: 'form',
  default: 'json'
} as { [key: string]: FormDataType | undefined };
