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

type AllCountries = {
  code: string;
  name: string;
};

type AllHolidays = {
  [code: string]: holiday[];
};

type holiday = {
  name: string;
  date: string;
  id: string;
};

type holidayList = {
  id: number;
  owner: number;
  country_codes: string[];
  holiday_ids: string[];
};

export {
  AllTasks,
  AllEntities,
  AllCategories,
  AllCountries,
  holiday,
  AllHolidays,
  holidayList
};
