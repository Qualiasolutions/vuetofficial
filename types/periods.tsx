export type PeriodReminder = {
  id: number;
  is_complete: boolean;
  period: number;
  reminder_date: string;
  reminder_timedelta: string;
  title: string;
};

export type ScheduledReminder = PeriodReminder & {
  entity: number;
  start_date: string;
  end_date: string;
  members: number[];
};

export type ParsedReminder = Omit<
  ScheduledReminder,
  'end_date' | 'start_date'
> & {
  end_date: Date;
  start_date: Date;
};

export type PeriodResponse = {
  end_date: string;
  entity: number;
  id: number;
  members: number[];
  polymorphic_ctype: number;
  resourcetype: string;
  start_date: string;
  title: string;
  reminders: PeriodReminder[];
};

export type ParsedPeriod = Omit<PeriodResponse, 'end_date' | 'start_date'> & {
  end_date: Date;
  start_date: Date;
};
