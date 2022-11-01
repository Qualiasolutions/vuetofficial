import { EntityTypeName } from 'types/entities';
import { FieldValueTypes } from '../types';

type DerivedFieldsMapping = {
  [key in EntityTypeName]?: (formValues: FieldValueTypes) => FieldValueTypes;
};

export const derivedFieldsMapping = {
  Flight: (formValues: FieldValueTypes) => ({
    name: `${formValues.carrier} ${formValues.booking_number || 'flight'}`
  }),
  TrainBusFerry: (formValues: FieldValueTypes) => ({
    name: `${formValues.carrier} ${formValues.booking_number || 'train'}`
  }),
  RentalCar: (formValues: FieldValueTypes) => ({
    name: `${formValues.carrier} ${formValues.booking_number || 'rental car'}`
  }),
  TaxiOrTransfer: (formValues: FieldValueTypes) => ({
    name: `${formValues.carrier} ${formValues.booking_number || 'taxi'}`
  }),
  DriveTime: (formValues: FieldValueTypes) => ({
    name: `Drive${
      formValues.start_location ? ` from ${formValues.start_location}` : ''
    } ${formValues.end_location ? ` to ${formValues.end_location}` : ''}`
  }),
  HotelOrRental: (formValues: FieldValueTypes) => ({
    name: `Stay at ${formValues.hotel_name}`
  }),
  StayWithFriend: (formValues: FieldValueTypes) => ({
    name: `Stay with ${formValues.friend_name}`
  })
} as DerivedFieldsMapping;
