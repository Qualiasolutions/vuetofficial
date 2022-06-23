export type CreatePhoneValidationRequest = {
    phone_number: string;
}

export type UpdatePhoneValidationRequest = {
    id: number;
    code: string;
}

export type PhoneValidationResponse = {
    id: number;
    phone_number: string;
    validated: boolean;
    created_at: string;
}

export type RegisterAccountRequest = {
    password: string;
    password2: string;
    phone_number: string;
}

export type RegisterAccountResponse = {
    phone_number: string;
}