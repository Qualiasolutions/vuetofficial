type PermittedTypes = 'string' | 'Date' | 'DateTime' | 'radio';

type BaseField<TypeName, ValueType> = {
  type: TypeName;
  required: boolean;
  displayName?: string | undefined;
  initialValue?: ValueType;
}

type StringField = BaseField<'string', string>
type DateField = BaseField<'Date', Date>
type DateTimeField = BaseField<'DateTime', Date>
type RadioField = BaseField<'radio', any> & {
  permittedValues: any[];
  valueToDisplay: Function;
}

type Field = StringField | DateField | DateTimeField | RadioField

export type FormFieldTypes = {
  [key: string]: Field;
};

export const isRadioField = (x: any): x is RadioField =>
  x.permittedValues && x.valueToDisplay;