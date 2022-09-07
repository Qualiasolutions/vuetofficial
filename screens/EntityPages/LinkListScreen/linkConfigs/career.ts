import { List } from './types';

export default [
  {
    name: 'career.daysOff',
    toScreen: 'EntityList',
    navMethod: 'push',
    toScreenParams: {
      entityTypes: ['DaysOff'],
      entityTypeName: 'days-off'
    }
  },
  {
    name: 'career.careerGoal',
    toScreen: 'EntityList',
    navMethod: 'push',
    toScreenParams: {
      entityTypes: ['CareerGoal'],
      entityTypeName: 'career-goal'
    }
  }
] as List[];
