export type ICalType = 'UNKNOWN' | 'GOOGLE' | 'ICLOUD';

export type ICalIntegration = {
  id: number;
  ical_name: string;
  ical_type: ICalType;
  user: number;
};

export type ICalIntegrationCreateRequest = {
  ical_url: string;
  user: number;
};
