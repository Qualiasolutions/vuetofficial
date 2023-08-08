export type SchoolTerm = {
  id: number;
  start_date: string;
  end_date: string;
  school: number;
  year: string;
};

export type AllSchoolTerms = {
  ids: number[];
  byId: { [key: number]: SchoolTerm };
  bySchool: { [key: number]: number[] };
};

export type SchoolBreak = {
  id: number;
  start_date: string;
  end_date: string;
  school_term: number;
};

export type AllSchoolBreaks = {
  ids: number[];
  byId: { [key: number]: SchoolBreak };
  byTerm: { [key: number]: number[] };
};
