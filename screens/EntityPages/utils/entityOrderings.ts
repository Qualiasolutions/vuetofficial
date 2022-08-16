import { EntityResponseType } from 'types/entities';
import dayjs from 'dayjs';

export const entityOrderings = {
  Birthday: (entity: EntityResponseType, otherEntity: EntityResponseType) => {
    if (
      dayjs(entity.start_date).month() < dayjs(otherEntity.start_date).month()
    ) {
      return -1;
    }
    if (
      dayjs(entity.start_date).month() ===
        dayjs(otherEntity.start_date).month() &&
      dayjs(entity.start_date).date() < dayjs(otherEntity.start_date).date()
    ) {
      return -1;
    }
    return 1;
  },
  Event: (entity: EntityResponseType, otherEntity: EntityResponseType) => {
    if (dayjs(entity.date) < dayjs(otherEntity.date)) {
      return -1;
    }
    return 1;
  },
  DaysOff: (entity: EntityResponseType, otherEntity: EntityResponseType) => {
    if (dayjs(entity.start_date) < dayjs(otherEntity.start_date)) {
      return -1;
    }
    return 1;
  }
} as {
  [key: string]:
    | ((entity: EntityResponseType, otherEntity: EntityResponseType) => number)
    | undefined;
};
