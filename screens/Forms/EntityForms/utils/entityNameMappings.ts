import { EntityTypeName } from 'types/entities';

export default {
  Car: 'Vehicle'
} as {
  [key in EntityTypeName]: string;
};
