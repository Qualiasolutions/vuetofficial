import { SchoolTermItemType } from 'types/tasks';

export const RESOURCE_TYPE_TO_TYPE: { [key: string]: SchoolTermItemType } = {
  SchoolTerm: 'SCHOOL_TERM',
  SchoolBreak: 'SCHOOL_BREAK',
  SchoolYearStart: 'SCHOOL_YEAR_START',
  SchoolYearEnd: 'SCHOOL_YEAR_END'
};
