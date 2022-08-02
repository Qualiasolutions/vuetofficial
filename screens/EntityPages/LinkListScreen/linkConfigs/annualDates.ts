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
    toScreen: '',
    navMethod: 'push',
    toScreenParams: {}
  }
] as List[];
