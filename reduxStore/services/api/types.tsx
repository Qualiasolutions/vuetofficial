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
type CalendarViewProps = {
  [key: string]: { backgroundColor: string; text: string, member_colour: string };
}

type allPeriods = {
    end_date: string,
    entity: number,
    id: number,
    members: number[],
    polymorphic_ctype: number,
    resourcetype: string,
    start_date: string,
    title: string,
}

export {
  AllTasks,
  AllEntities,
  AllCategories,
  Country,
  Holiday,
  AllHolidays,
  SelectedHolidays,
  HolidayList,
  CalendarViewProps,
  allPeriods
};
