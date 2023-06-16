import { AlertName } from './alerts';

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

type TaskResourceType = 'FixedTask' | 'DueDate';

interface BaseTaskType {
  entities: number[];
  id: number;
  is_complete: boolean;
  location: string;
  polymorphic_ctype: number;
  resourcetype: TaskResourceType;
  title: string;
  hidden_tag: string;
  tags: string[];
  members: number[];
  recurrence?: Recurrence | null;
  recurrence_index?: number;
  reminders: Reminder[];
  routine: number | null;
  created_at: string;
  date?: string;
  duration?: string;
  start_datetime?: string;
  end_datetime?: string;
}

interface FixedTaskResponseType extends BaseTaskType {}

type FixedTaskParsedType = BaseTaskType & {
  end_datetime: Date;
  start_datetime: Date;
  resourcetype: 'FixedTask';
};

interface DueDateResponseType extends BaseTaskType {}

interface ScheduledTaskResponseType {
  id: number;
  is_complete: boolean;
  members: number[];
  entities: number[];
  tags: string[];
  recurrence: number | null;
  recurrence_index: number | null;
  routine: number | null;
  title: string;
  resourcetype: 'FixedTask' | 'DueDate';
  alert: AlertName[];
  date?: string;
  duration?: string;
  start_datetime?: string;
  end_datetime?: string;
}

type TaskParsedType = FixedTaskParsedType;

interface BaseCreateTaskRequest {
  title: string;
  members: number[];
  entities: number[];
  location?: string;
  reminders?: Reminder[];
}

interface CreateFixedTaskRequest extends BaseCreateTaskRequest {
  start_datetime: string;
  end_datetime: string;
  resourcetype: 'FixedTask';
}

interface CreateDueDateRequest extends BaseCreateTaskRequest {
  date: string;
  resourcetype: 'DueDate';
}

interface CreateFlexibleFixedTaskRequest extends BaseCreateTaskRequest {
  earliest_action_date: string;
  due_date: string;
  duration_minutes: number;
}

type CreateTaskRequest =
  | CreateFixedTaskRequest
  | CreateDueDateRequest
  | CreateFlexibleFixedTaskRequest;

export {
  TaskResourceType,
  RecurrenceType,
  Recurrence,
  Reminder,
  FixedTaskResponseType,
  FixedTaskParsedType,
  DueDateResponseType,
  TaskParsedType,
  CreateTaskRequest,
  CreateFixedTaskRequest,
  CreateDueDateRequest,
  CreateFlexibleFixedTaskRequest,
  ScheduledTaskResponseType
};
