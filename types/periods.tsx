export type PeriodReminder = {
  id: number;
  is_complete?: boolean;
  period: number;
  reminder_date: string;
  reminder_timedelta: string;
  title: string;
};

export type PeriodResponse = {
  end_date: string;
  entities: number[];
  id: number;
  members: number[];
  polymorphic_ctype: number;
  resourcetype: string;
  start_date: string;
  title: string;
  reminders?: PeriodReminder[];
};

export type ParsedPeriod = Omit<
  PeriodResponse,
  'end_date' | 'start_date' | 'reminders'
> & {
  end_date: Date;
  start_date: Date;
};
