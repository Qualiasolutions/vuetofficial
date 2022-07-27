import { UseTranslationResponse } from 'react-i18next';

export type PermittedTypes =
  | 'string'
  | 'Date'
  | 'DateTime'
  | 'radio'
  | 'colour'
  | 'phoneNumber'
  | 'addMembers';

export type BaseField<TypeName, ValueType> = {
  type: TypeName;
  required: boolean;
  displayName?: string | UseTranslationResponse<string> | undefined;
  initialValue?: ValueType;
};

export type StringField = BaseField<'string', string>;
export type DateField = BaseField<'Date', Date>;
export type DateTimeField = BaseField<'DateTime', Date>;
export type RadioField = BaseField<'radio', any> & {
  permittedValues: any[];
  valueToDisplay: Function;
};
export type AddMembersField = BaseField<'addMembers', any> & {
  permittedValues: any[];
  valueToDisplay: Function;
};

// TODO - make these more specific (match regex?)
export type ColourField = BaseField<'colour', string>;
export type PhoneNumberField = BaseField<'phoneNumber', string>;

export type Field =
  | StringField
  | DateField
  | DateTimeField
  | RadioField
  | ColourField
  | PhoneNumberField
  | AddMembersField;

export type FormFieldTypes = {
  [key: string]: Field;
};

export const isRadioField = (x: any): x is RadioField =>
  x.permittedValues && x.valueToDisplay;

export const hasPermittedValues = (x: any): x is AddMembersField | RadioField =>
  !!x.permittedValues;
