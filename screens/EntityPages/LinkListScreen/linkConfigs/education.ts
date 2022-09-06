import { List } from './types';

export default [
  {
    name: 'education.schoolTerms',
    toScreen: 'EntityList',
    navMethod: 'push',
    toScreenParams: {
      entityTypes: ['SchoolTerm'],
      entityTypeName: 'school-terms'
    }
  },
  {
    name: 'education.academicPlans',
    toScreen: 'EntityList',
    navMethod: 'push',
    toScreenParams: {
      entityTypes: ['AcademicPlan'],
      entityTypeName: 'academic-plans'
    }
  },
  {
    name: 'education.extracurricularPlans',
    toScreen: 'EntityList',
    navMethod: 'push',
    toScreenParams: {
      entityTypes: ['ExtracurricularPlan'],
      entityTypeName: 'extracurricular-plans'
    }
  },
  {
    name: 'education.schedules',
    toScreen: '',
    navMethod: 'push',
    toScreenParams: {}
  },
  {
    name: 'education.lists',
    toScreen: '',
    navMethod: 'push',
    toScreenParams: {}
  }
] as List[];
