import { List } from './types';

export default [
  {
    name: 'annualDates.anniversaries',
    toScreen: 'EntityList',
    navMethod: 'push',
    toScreenParams: {
      entityTypes: ['Birthday', 'Anniversary'],
      entityTypeName: 'anniversaries'
    }
  },
  {
    name: 'annualDates.nationalHolidays',
    toScreen: 'EntityList',
    navMethod: 'push',
    toScreenParams: {
      entityTypes: ['Holiday'],
      entityTypeName: 'holidays'
    }
  }
] as List[];
