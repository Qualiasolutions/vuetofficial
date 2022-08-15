import { TaskResponseType } from 'types/tasks';
import { EntityResponseType } from 'types/entities';
import { FamilyResponse } from 'types/families';
import { Category } from 'types/categories';

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
};

type Country = {
  code: string;
  name: string;
};

type Holiday = {
  name: string;
  date: string;
  id: string;
};

type AllHolidays = {
  [code: string]: Holiday[];
};

type SelectedHolidays = {
  id: number;
  owner: number;
  country_codes: string;
  holiday_ids: string;
};

type HolidayList = {
  id: number;
  owner: number;
  country_codes: string[];
  holiday_ids: string[];
};

export {
  AllTasks,
  AllEntities,
  AllCategories,
  Country,
  Holiday,
  AllHolidays,
  SelectedHolidays,
  HolidayList
};
