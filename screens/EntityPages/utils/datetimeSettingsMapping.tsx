import { EntityTypeName } from 'types/entities';

export const datetimeSettingsMapping: {
  [key in EntityTypeName]?: {
    datetimeType: 'date' | 'datetime';
    startField: string;
    endField: string;
    hidePrevious: boolean;
    allowShowPrevious: boolean;
  };
} = {
  Trip: {
    datetimeType: 'date',
    startField: 'start_date',
    endField: 'end_date',
    hidePrevious: true,
    allowShowPrevious: true
  }
};
