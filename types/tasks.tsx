import { AlertName } from './alerts';
import { EntityTypeName } from './entities';

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
  id: number;
  earliest_occurrence: string;
  latest_occurrence: string | null;
  interval_length: number;
  recurrence: RecurrenceType;
}

interface Reminder {
  id: number;
  timedelta: string;
}

type ScheduledTaskResourceType = 'FixedTask' | 'TaskAction';
type TaskResourceType = 'FixedTask' | 'TransportTask';
type ScheduledTaskType = 'TASK' | 'ACTION';
type TransportTaskType =
  | 'FLIGHT'
  | 'TRAIN'
  | 'RENTAL_CAR'
  | 'TAXI'
  | 'DRIVE_TIME';
type TaskType = 'TASK' | 'APPOINTMENT' | 'DUE_DATE' | TransportTaskType;

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
  duration?: number;
  start_datetime?: string;
  end_datetime?: string;
  type: TaskType;
}

interface FixedTaskResponseType extends BaseTaskType {}

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
  resourcetype: ScheduledTaskResourceType;
  alert: AlertName[];
  date?: string;
  duration?: number;
  start_datetime?: string;
  end_datetime?: string;
}

interface ScheduledEntityResponseType {
  id: number;
  members: number[];
  title: string;
  resourcetype: EntityTypeName;
  start_date: string;
  end_date: string;
}

interface BaseCreateTaskRequest {
  title: string;
  members: number[];
  entities: number[];
  location?: string;
  reminders?: Omit<Reminder, 'id'>[];
  actions?: { action_timedelta: string }[];
  hidden_tag?: HiddenTagType;
  type?: TaskType;
}

interface CreateFixedTaskRequest extends BaseCreateTaskRequest {
  start_datetime?: string;
  end_datetime?: string;
  date?: string;
  duration?: number;
  resourcetype: 'FixedTask';
}

interface CreateFlexibleFixedTaskRequest extends BaseCreateTaskRequest {
  earliest_action_date: string;
  due_date: string;
  duration: number;
}

interface CreateRecurrentTaskOverwriteRequest {
  task: CreateFixedTaskRequest | null;
  recurrence: number;
  recurrence_index: number;
  baseTaskId: number;
}

type CreateTaskRequest =
  | CreateFixedTaskRequest
  | CreateFlexibleFixedTaskRequest;

type HiddenTagType =
  | 'MOT_DUE'
  | 'INSURANCE_DUE'
  | 'WARRANTY_DUE'
  | 'SERVICE_DUE'
  | 'TAX_DUE';

export {
  TransportTaskType,
  TaskType,
  ScheduledTaskResourceType,
  ScheduledTaskType,
  RecurrenceType,
  Recurrence,
  Reminder,
  FixedTaskResponseType,
  CreateTaskRequest,
  CreateFixedTaskRequest,
  CreateFlexibleFixedTaskRequest,
  CreateRecurrentTaskOverwriteRequest,
  ScheduledTaskResponseType,
  ScheduledEntityResponseType,
  HiddenTagType
};
