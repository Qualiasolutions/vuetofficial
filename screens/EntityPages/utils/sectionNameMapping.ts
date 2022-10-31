import { EntityResponseType } from 'types/entities';
import { getUTCValuesFromDateString } from 'utils/datesAndTimes';

const getMonthFromDateField = (
  entity: EntityResponseType,
  fieldName: string
) => {
  const { monthName } = getUTCValuesFromDateString(entity[fieldName]);
  return monthName;
};

const getMonthAndYearFromDateField = (
  entity: EntityResponseType,
  fieldName: string
) => {
  const { monthName, year } = getUTCValuesFromDateString(entity[fieldName]);
  return `${monthName} ${year}`;
};

export const sectionNameMapping = {
  Birthday: (entity: EntityResponseType) =>
    getMonthFromDateField(entity, 'start_date'),
  Holiday: (entity: EntityResponseType) =>
    getMonthAndYearFromDateField(entity, 'start_date'),
  Event: (entity: EntityResponseType) =>
    getMonthAndYearFromDateField(entity, 'date'),
  DaysOff: (entity: EntityResponseType) =>
    getMonthAndYearFromDateField(entity, 'start_date'),
  Trip: (entity: EntityResponseType) =>
    getMonthAndYearFromDateField(entity, 'start_date')
} as { [key: string]: ((entity: EntityResponseType) => string) | undefined };
