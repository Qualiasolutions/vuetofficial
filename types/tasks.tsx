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
  hidden_tag: string;
  members: number[];
  recurrence?: Recurrence | null;
  recurrence_index?: number;
  reminders: Reminder[];
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
  recurrence: number | null;
  recurrence_index: number | null;
  title: string;
  resourcetype: 'FixedTask' | 'DueDate';
  alert: AlertName[];
  date?: string;
  duration?: string;
  start_datetime?: string;
  end_datetime?: string;
}

type TaskParsedType = FixedTaskParsedType | FlexibleTaskParsedType;

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
  RecurrenceType,
  Recurrence,
  Reminder,
  FixedTaskResponseType,
  FixedTaskParsedType,
  DueDateResponseType,
  FlexibleTaskResponseType,
  FlexibleTaskParsedType,
  TaskParsedType,
  CreateTaskRequest,
  CreateFixedTaskRequest,
  CreateDueDateRequest,
  CreateFlexibleFixedTaskRequest,
  ScheduledTaskResponseType
};
