import { LinkListLink } from "components/lists/LinkList";

export default [
  {
    name: 'education.schools',
    toScreen: 'EntityList',
    navMethod: 'push',
    toScreenParams: {
      entityTypes: ['School'],
      entityTypeName: 'schools'
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
    name: 'generic.calendar',
    toScreen: 'EntityTypesCalendarScreen',
    navMethod: 'push',
    toScreenParams: {
      entityTypes: [
        'School',
        'AcademicPlan',
        'ExtracurricularPlan',
        'SchoolBreak'
      ]
    }
  },
  {
    name: 'generic.lists',
    toScreen: '',
    navMethod: 'push',
    toScreenParams: {}
  }
] as LinkListLink[];
