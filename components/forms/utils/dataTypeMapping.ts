import { FormDataType } from "../RTKForm";

export const dataTypeMapping = {
    Pet: 'form',
    default: 'json'
  } as { [key: string]: FormDataType | undefined };
  