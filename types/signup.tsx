import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

export type CreatePhoneValidationRequest = {
  phone_number: string;
};

export type UpdatePhoneValidationRequest = {
  id: number;
  code: string;
};

export type PhoneValidationResponse = {
  id: number;
  phone_number: string;
  validated: boolean;
  created_at: string;
};

export type RegisterAccountRequest = {
  password: string;
  password2: string;
  phone_number: string;
};

export type RegisterAccountResponse = {
  phone_number: string;
  access_token: string;
  refresh_token: string;
};

export function isInvalidPhoneNumberError(
  error: unknown
): error is { data: { phone_number: ['Enter a valid phone number.' | 'The phone number entered is not valid.'] } } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'data' in error &&
    typeof ((error as any).data as any) === 'object' &&
    typeof ((error as any).data as any).phone_number === 'object' &&
    [
      'Enter a valid phone number.',
      'The phone number entered is not valid.'
    ]
      .includes((((error as any).data as any).phone_number as any)['0'])
  );
}

/*
This helper function produces type-checking functions which return true if the
fieldName field has an error of code errorCode. i.e. if the error returned is
of the form:

{
  data: {
    [fieldName]: {
      code: errorCode,
      ...
    }
  },
  ...
}
*/
export function isFieldErrorCodeError(
  fieldName: string,
  errorCode: string
): (error: any) => boolean {
  return (error) => {
    return (
      typeof error === 'object' &&
      error !== null &&
      'data' in error &&
      typeof (error as any).data === 'object' &&
      typeof ((error as any).data as any) === 'object' &&
      typeof ((error as any).data as any)[fieldName] === 'object' &&
      (((error as any).data as any)[fieldName] as any).code === errorCode
    );
  };
}
