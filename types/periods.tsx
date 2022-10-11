export type PeriodResponse = {
  end_date: string;
  entity: number;
  id: number;
  members: number[];
  polymorphic_ctype: number;
  resourcetype: string;
  start_date: string;
  title: string;
};

export type ParsedPeriod = Omit<PeriodResponse, 'end_date' | 'start_date'> & {
  end_date: Date;
  start_date: Date
}