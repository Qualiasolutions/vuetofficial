import { LinkListLink } from 'components/lists/LinkList';

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
      entityTypeName: 'career-goals'
    }
  },
  {
    name: 'generic.calendar',
    toScreen: 'EntityTypesCalendarScreen',
    navMethod: 'push',
    toScreenParams: {
      entityTypes: ['DaysOff', 'CareerGoal']
    }
  },
  {
    name: 'generic.lists',
    toScreen: '',
    navMethod: 'push',
    toScreenParams: {}
  }
] as LinkListLink[];
