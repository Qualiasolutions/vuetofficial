export type SchoolYear = {
  id: number;
  start_date: string;
  end_date: string;
  school: number;
  year: string;
};

export type AllSchoolYears = {
  ids: number[];
  byId: { [key: number]: SchoolYear };
  bySchool: { [key: number]: number[] };
};

export type SchoolBreak = {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  school_year: number;
};

export type AllSchoolBreaks = {
  ids: number[];
  byId: { [key: number]: SchoolBreak };
  byYear: { [key: number]: number[] };
};

export type SchoolTerm = {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  school_year: number;
};

export type AllSchoolTerms = {
  ids: number[];
  byId: { [key: number]: SchoolTerm };
  byYear: { [key: number]: number[] };
};
