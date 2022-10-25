import { FormDataType } from '../RTKForm';

export const dataTypeMapping = {
  Pet: 'form',
  Car: 'form',
  default: 'json'
} as { [key: string]: FormDataType | undefined };
