import { EntityResponseType } from 'types/entities';
import { monthNames } from 'utils/datesAndTimes';

export const sectionNameMapping = {
  Birthday: (entity: EntityResponseType) => {
    return monthNames[Number(entity.start_date?.split('-')[1]) - 1];
  }
} as { [key: string]: ((entity: EntityResponseType) => string) | undefined };
