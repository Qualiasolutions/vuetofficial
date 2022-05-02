interface FixedTaskResponseType {
  end_datetime: string;
  entity: number;
  id: number;
  location: string;
  polymorphic_ctype: number;
  resourcetype: 'FixedTask';
  start_datetime: string;
  title: string;
}

interface FixedTaskParsedType {
  end_datetime: Date;
  entity: number;
  id: number;
  location: string;
  polymorphic_ctype: number;
  resourcetype: 'FixedTask';
  start_datetime: Date;
  title: string;
}

interface FlexibleTaskResponseType {
  due_date: string;
  entity: number;
  id: number;
  location: string;
  polymorphic_ctype: number;
  resourcetype: 'FlexibleTask';
  title: string;
}

interface FlexibleTaskParsedType {
  due_date: Date;
  entity: number;
  id: number;
  location: string;
  polymorphic_ctype: number;
  resourcetype: 'FlexibleTask';
  title: string;
}

type TaskResponseType = FixedTaskResponseType | FlexibleTaskResponseType
type TaskParsedType = FixedTaskParsedType | FlexibleTaskParsedType

const isFixedTaskResponseType = (task: any): task is FixedTaskResponseType => task.resourcetype === 'FixedTask'
const isFlexibleTaskResponseType = (task: any): task is FlexibleTaskResponseType => task.resourcetype === 'FlexibleTask'
const isFixedTaskParsedType = (task: any): task is FixedTaskParsedType => task.resourcetype === 'FixedTask'
const isFlexibleTaskParsedType = (task: any): task is FlexibleTaskParsedType => task.resourcetype === 'FlexibleTask'

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
  isFlexibleTaskParsedType,
}
