type PermittedTypes = 'string' | 'Date' | 'DateTime';

export type FormFieldTypes = {
  [key: string]: {
    type: PermittedTypes;
    required: boolean;
    displayName?: string | undefined;
    initialValue?: PermittedTypes;
  };
};
