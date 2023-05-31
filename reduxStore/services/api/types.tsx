import { TaskResponseType } from 'types/tasks';
import { EntityResponseType } from 'types/entities';
import { FamilyResponse } from 'types/families';
import { Category } from 'types/categories';
import { PeriodResponse } from 'types/periods';

type AllTasks = {
  ids: number[];
  byId: {
    [id: number]: TaskResponseType;
  };
};

type AllEntities = {
  ids: number[];
  byId: {
    [id: number]: EntityResponseType;
  };
};

type AllCategories = {
  ids: number[];
  byId: {
    [id: number]: Category;
  };
  byName: {
    [name: string]: Category;
  };
};

type Country = {
  code: string;
  name: string;
};

type Holiday = {
  name: string;
  start_date: string;
  end_date: string;
  id: string;
  country_code: string;
};

type AllHolidays = {
  [code: string]: Holiday[];
};

type SelectedHoliday = {
  id: number;
  country_code: string;
  start_date: string;
  end_date: string;
  name: number;
};

type HolidayList = {
  id: number;
  country_codes: string[];
  holiday_ids: string[];
};

type AllPeriods = {
  ids: number[];
  byId: {
    [id: number]: PeriodResponse;
  };
};

export {
  AllTasks,
  AllEntities,
  AllPeriods,
  AllCategories,
  Country,
  Holiday,
  AllHolidays,
  SelectedHoliday,
  HolidayList
};
