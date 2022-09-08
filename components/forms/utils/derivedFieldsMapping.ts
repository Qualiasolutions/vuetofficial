import { EntityTypeName } from 'types/entities';
import { FieldValueTypes } from '../types';

type DerivedFieldsMapping = {
  [key in EntityTypeName]?: (formValues: FieldValueTypes) => FieldValueTypes;
};

export const derivedFieldsMapping = {
  Flight: (formValues: FieldValueTypes) => ({
    name: `${formValues.carrier} ${formValues.booking_number}`
  }),
  TrainBusFerry: (formValues: FieldValueTypes) => ({
    name: `${formValues.carrier} ${formValues.booking_number}`
  }),
  RentalCar: (formValues: FieldValueTypes) => ({
    name: `${formValues.carrier} ${formValues.booking_number}`
  }),
  TaxiOrTransfer: (formValues: FieldValueTypes) => ({
    name: `${formValues.carrier} ${formValues.booking_number}`
  }),
  DriveTime: (formValues: FieldValueTypes) => ({
    name: `Drive ${formValues.start_location} to ${formValues.end_location}`
  }),
  HotelOrRental: (formValues: FieldValueTypes) => ({
    name: `Stay at ${formValues.hotel_name}`
  }),
  StayWithFriend: (formValues: FieldValueTypes) => ({
    name: `Stay with ${formValues.friend_name}`
  })
} as DerivedFieldsMapping;
