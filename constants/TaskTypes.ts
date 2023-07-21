import { TransportTaskType } from 'types/tasks';

export const TRANSPORT_TASK_TYPES: { [key in TransportTaskType]: string } = {
  FLIGHT: 'Flight',
  TRAIN: 'Train',
  RENTAL_CAR: 'Rental Car',
  TAXI: 'Taxi',
  DRIVE_TIME: 'Drive Time'
};

export const isTransportTaskType = (val: string): val is TransportTaskType => {
  return val in TRANSPORT_TASK_TYPES;
};
