import { EntityTypeName } from 'types/entities';

type DatetimeSettings = {
  datetimeType: 'date' | 'datetime';
  startField: string;
  endField: string;
  hidePrevious: boolean;
  allowShowPrevious: boolean;
};

const pastLoadableConfig: DatetimeSettings = {
  datetimeType: 'date',
  startField: 'start_date',
  endField: 'end_date',
  hidePrevious: true,
  allowShowPrevious: true
};

export const datetimeSettingsMapping: {
  [key in EntityTypeName]?: DatetimeSettings;
} = {
  Trip: pastLoadableConfig,
  SchoolBreak: pastLoadableConfig,
  DaysOff: pastLoadableConfig
};
