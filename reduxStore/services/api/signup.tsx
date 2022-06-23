import { vuetApi } from './api';
import { CreatePhoneValidationRequest, PhoneValidationResponse, RegisterAccountRequest, RegisterAccountResponse, UpdatePhoneValidationRequest } from 'types/signup';

const extendedApi = vuetApi.injectEndpoints({
  endpoints: (builder) => ({
    updatePhoneValidation: builder.mutation<
      PhoneValidationResponse,
      UpdatePhoneValidationRequest
    >({
      query: (body) => {
        return {
          url: `auth/phone-validation/${body.id}/`,
          method: 'PATCH',
          body
        };
      }
    }),
    createPhoneValidation: builder.mutation<PhoneValidationResponse, CreatePhoneValidationRequest>({
      query: (body) => {
        return {
          url: 'auth/phone-validation/',
          method: 'POST',
          body
        };
      }
    }),
    createAccount:  builder.mutation<RegisterAccountResponse, RegisterAccountRequest>({
        query: (body) => {
          return {
            url: 'auth/register/',
            method: 'POST',
            body
          };
        }
      }),
  }),
  overrideExisting: true
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useUpdatePhoneValidationMutation,
  useCreatePhoneValidationMutation,
  useCreateAccountMutation
} = extendedApi;
