import { List } from './types';

export default [
    {
        name: 'career.daysoff',
        toScreen: 'EntityList',
        navMethod: 'push',
        toScreenParams: {
            entityTypes: ['DaysOff'],
            entityTypeName: 'DaysOff'
        }
    },
    {
        name: 'career.careerGoal',
        toScreen: '',
        navMethod: 'push',
        toScreenParams: {}
    }
] as List[];
