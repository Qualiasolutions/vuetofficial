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

type TaskResourceType = 'FixedTask' | 'DueDate' | 'TaskAction';
type ScheduledTaskType = 'TASK' | 'ACTION';

interface BaseTaskType {
  entities: number[];
  id: number;
  is_complete: boolean;
  location: string;
  polymorphic_ctype: number;
  resourcetype: TaskResourceType;
  title: string;
  hidden_tag: HiddenTagType;
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

interface DueDateResponseType extends BaseTaskType {}

interface ScheduledTaskResponseType {
  id: number;
  is_complete: boolean;
  action_id: number | null;
  members: number[];
  entities: number[];
  tags: string[];
  recurrence: number | null;
  recurrence_index: number | null;
  routine: number | null;
  title: string;
  resourcetype: 'FixedTask' | 'DueDate' | 'TaskAction';
  alert: AlertName[];
  date?: string;
  duration?: string;
  start_datetime?: string;
  end_datetime?: string;
}

interface BaseCreateTaskRequest {
  title: string;
  members: number[];
  entities: number[];
  location?: string;
  reminders?: Reminder[];
  actions?: { action_timedelta: string }[];
  hidden_tag?: HiddenTagType;
}

interface CreateFixedTaskRequest extends BaseCreateTaskRequest {
  start_datetime: string;
  end_datetime: string;
  resourcetype: 'FixedTask';
}

interface CreateDueDateRequest extends BaseCreateTaskRequest {
  date: string;
  duration: number;
  resourcetype: 'DueDate';
}

interface CreateFlexibleFixedTaskRequest extends BaseCreateTaskRequest {
  earliest_action_date: string;
  due_date: string;
  duration: number;
}

type CreateTaskRequest =
  | CreateFixedTaskRequest
  | CreateDueDateRequest
  | CreateFlexibleFixedTaskRequest;

type HiddenTagType =
  | 'MOT_DUE'
  | 'INSURANCE_DUE'
  | 'WARRANTY_DUE'
  | 'SERVICE_DUE'
  | 'TAX_DUE';

export {
  TaskResourceType,
  ScheduledTaskType,
  RecurrenceType,
  Recurrence,
  Reminder,
  FixedTaskResponseType,
  DueDateResponseType,
  CreateTaskRequest,
  CreateFixedTaskRequest,
  CreateDueDateRequest,
  CreateFlexibleFixedTaskRequest,
  ScheduledTaskResponseType,
  HiddenTagType
};
