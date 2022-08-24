import { EntityResponseType } from 'types/entities';
import { monthNames } from 'utils/datesAndTimes';

const getMonthFromDateField = (entity: EntityResponseType, fieldName: string) => {
  // TODO - support other languages by using dayJS
  return monthNames[Number(entity[fieldName]?.split('-')[1]) - 1];
}

const getMonthAndYearFromDateField = (entity: EntityResponseType, fieldName: string) => {
  // TODO - support other languages by using dayJS
  return `${monthNames[Number(entity[fieldName]?.split('-')[1]) - 1]} ${
    entity[fieldName]?.split('-')[0]
  }`;
}

export const sectionNameMapping = {
  Birthday: (entity: EntityResponseType) => getMonthFromDateField(entity, 'start_date'),
  Holiday: (entity: EntityResponseType) => getMonthAndYearFromDateField(entity, 'start_date'),
  Event: (entity: EntityResponseType) => getMonthAndYearFromDateField(entity, 'date'),
  DaysOff: (entity: EntityResponseType) => getMonthAndYearFromDateField(entity, 'start_date'),
} as { [key: string]: ((entity: EntityResponseType) => string) | undefined };
