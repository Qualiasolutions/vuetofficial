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
