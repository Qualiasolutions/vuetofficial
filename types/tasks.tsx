type RecurrenceType =
  | 'DAILY'
  | 'WEEKLY'
  | 'WEEKDAILY'
  | 'MONTHLY'
  | 'MONTH_WEEKLY'
  | 'MONTHLY_LAST_WEEK'
  | 'YEARLY'
  | 'YEAR_MONTH_WEEKLY';

interface Recurrence {
  earliest_occurrence: string;
  latest_occurrence: string | null;
  interval_length: number;
  recurrence: RecurrenceType;
}

interface Reminder {
  earliest_timedelta: string;
  interval_length: number;
  recurrence_type: RecurrenceType;
}

interface BaseTaskType {
  entities: number[];
  id: number;
  is_complete: boolean;
  location: string;
  polymorphic_ctype: number;
  resourcetype: string;
  title: string;
  members: number[];
  recurrence?: Recurrence | null;
  recurrence_index?: number;
  reminders: Reminder[];
}

interface FixedTaskResponseType extends BaseTaskType {
  end_datetime: string;
  resourcetype: 'FixedTask';
  start_datetime: string;
}

interface FixedTaskParsedType extends BaseTaskType {
  end_datetime: Date;
  resourcetype: 'FixedTask';
  start_datetime: Date;
}

interface FlexibleTaskResponseType extends BaseTaskType {
  due_date: string;
  resourcetype: 'FlexibleTask';
}

interface FlexibleTaskParsedType extends BaseTaskType {
  due_date: Date;
  resourcetype: 'FlexibleTask';
}

type AlertName = 'FIXED_TASK_CONFLICT' | 'NO_PLACEMENT' | 'UNPREFERRED_DAY';
interface ScheduledTaskResponseType {
  id: number;
  is_complete: boolean;
  members: number[];
  entities: number[];
  start_datetime: string;
  end_datetime: string;
  recurrence: number | null;
  recurrence_index: number | null;
  title: string;
  resourcetype: 'FixedTask' | 'FlexibleTask';
  alert: AlertName[];
}

interface ScheduledTaskParsedType extends BaseTaskType {
  start_datetime: Date;
  end_datetime: Date;
  recurrence_index?: number;
}

type TaskParsedType = FixedTaskParsedType | FlexibleTaskParsedType;

type CreateTaskRequest = {
  start_datetime?: string;
  end_datetime?: string;
  resourcetype: string;
};

export {
  RecurrenceType,
  Recurrence,
  Reminder,
  FixedTaskResponseType,
  FixedTaskParsedType,
  FlexibleTaskResponseType,
  FlexibleTaskParsedType,
  TaskParsedType,
  CreateTaskRequest,
  ScheduledTaskResponseType,
  ScheduledTaskParsedType
};
