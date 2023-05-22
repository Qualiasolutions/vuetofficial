type RecurrenceType = "DAILY" |
  "WEEKLY" |
  "WEEKDAILY" |
  "MONTHLY" |
  "MONTH_WEEKLY" |
  "MONTHLY_LAST_WEEK" |
  "YEARLY" |
  "YEAR_MONTH_WEEKLY"

interface Recurrence {
  earliest_occurrence: string;
  latest_occurrence: string | null;
  interval_length: number;
  recurrence: RecurrenceType;
}

interface BaseTaskType {
  entity: number;
  id: number;
  is_complete: boolean;
  location: string;
  polymorphic_ctype: number;
  resourcetype: string;
  title: string;
  members: number[];
  recurrence?: Recurrence | null;
  recurrence_index?: number;
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

interface ScheduledTaskResponseType extends BaseTaskType {
  start_datetime: string;
  end_datetime: string;
}

interface ScheduledTaskParsedType extends BaseTaskType {
  start_datetime: Date;
  end_datetime: Date;
  recurrence_index?: number;
}

type TaskResponseType =
  | FixedTaskResponseType
  | FlexibleTaskResponseType
  | ScheduledTaskResponseType;
type TaskParsedType = FixedTaskParsedType | FlexibleTaskParsedType;

const isFixedTaskResponseType = (task: any): task is FixedTaskResponseType =>
  task.resourcetype === 'FixedTask';
const isFlexibleTaskResponseType = (
  task: any
): task is FlexibleTaskResponseType => task.resourcetype === 'FlexibleTask';
const isFixedTaskParsedType = (task: any): task is FixedTaskParsedType =>
  task.resourcetype === 'FixedTask';
const isFlexibleTaskParsedType = (task: any): task is FlexibleTaskParsedType =>
  task.resourcetype === 'FlexibleTask';

export {
  RecurrenceType,
  Recurrence,
  FixedTaskResponseType,
  FixedTaskParsedType,
  FlexibleTaskResponseType,
  FlexibleTaskParsedType,
  TaskResponseType,
  TaskParsedType,
  ScheduledTaskResponseType,
  ScheduledTaskParsedType,
  isFixedTaskResponseType,
  isFlexibleTaskResponseType,
  isFixedTaskParsedType,
  isFlexibleTaskParsedType
};
