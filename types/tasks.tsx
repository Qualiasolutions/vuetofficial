interface BaseTaskType {
  entity: number;
  id: number;
  is_complete: boolean;
  location: string;
  polymorphic_ctype: number;
  resourcetype: string;
  title: string;
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

type TaskResponseType = FixedTaskResponseType | FlexibleTaskResponseType;
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
  FixedTaskResponseType,
  FixedTaskParsedType,
  FlexibleTaskResponseType,
  FlexibleTaskParsedType,
  TaskResponseType,
  TaskParsedType,
  isFixedTaskResponseType,
  isFlexibleTaskResponseType,
  isFixedTaskParsedType,
  isFlexibleTaskParsedType
};
