import { UseTranslationResponse } from 'react-i18next';
import { ListModeType } from 'react-native-dropdown-picker';

export type PermittedTypes =
  | 'string'
  | 'Date'
  | 'OptionalYearDate'
  | 'DateTime'
  | 'radio'
  | 'colour'
  | 'phoneNumber'
  | 'addMembers'
  | 'TextArea'
  | 'addFamilyMembers'
  | 'dropDown'
  | 'dropDownWithOther'
  | 'Image';

export type BaseField<TypeName, ValueType> = {
  type: TypeName;
  required: boolean;
  displayName?: string | UseTranslationResponse<string> | undefined;
  initialValue?: ValueType;
};

export type StringField = BaseField<'string', string>;
export type TextArea = BaseField<'TextArea', string>;
export type DateField = BaseField<'Date', Date>;
export type OptionalYearDate = BaseField<'OptionalYearDate', Date> & {
  knownYearField?: string | undefined;
};
export type DateTimeField = BaseField<'DateTime', Date>;
export type RadioField = BaseField<'radio', any> & {
  permittedValues: any[];
  valueToDisplay: Function;
};
export type AddMembersField = BaseField<'addMembers', any> & {
  permittedValues: any[];
  valueToDisplay: Function;
};
export type AddFamilyMembersField = BaseField<'addFamilyMembers', any> & {
  permittedValues: any[];
  valueToDisplay: Function;
};

export type DropDownField = BaseField<'dropDown', any> & {
  permittedValues: any[];
  displayName?: string;
  initialValue?: {
    label: string;
    value: string;
  }[];
  placeholder?: string;
  listMode?: ListModeType;
};
export type DropDownWithOtherField = BaseField<'dropDownWithOther', any> & {
  permittedValues: any[];
  displayName?: string;
  initialValue?: {
    label: string;
    value: string;
  }[];
  placeholder?: string;
  listMode?: ListModeType;
};

// TODO - make these more specific (match regex?)
export type ColourField = BaseField<'colour', string>;
export type PhoneNumberField = BaseField<'phoneNumber', string>;

export type ImageField = BaseField<'Image', object> & {
  sourceField: string;
};

export type Field =
  | StringField
  | DateField
  | OptionalYearDate
  | DateTimeField
  | RadioField
  | ColourField
  | PhoneNumberField
  | AddMembersField
  | TextArea
  | AddFamilyMembersField
  | DropDownField
  | DropDownWithOtherField
  | ImageField;

export type FormFieldTypes = {
  [key: string]: Field;
};

export const hasValueToDisplay = (
  x: any
): x is AddMembersField | AddFamilyMembersField | RadioField =>
  x.valueToDisplay;

export const hasPermittedValues = (
  x: any
): x is
  | AddMembersField
  | AddFamilyMembersField
  | RadioField
  | DropDownField
  | DropDownWithOtherField => !!x.permittedValues;

export const hasPlaceholder = (
  x: any
): x is DropDownField | DropDownWithOtherField => !!x.placeholder;

export const hasListMode = (
  x: any
): x is DropDownField | DropDownWithOtherField => !!x.listMode;
