import { TaskResponseType } from 'types/tasks';
import { EntityResponseType } from 'types/entities';
import { FamilyResponseType } from 'types/families';
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

type UserFullDetails = {
  id: number;
  family: FamilyResponseType;
  last_login: string;
  is_superuser: boolean;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  member_colour: string;
  dob: string;
  has_done_setup: boolean;
};

export { AllTasks, AllEntities, AllCategories, UserFullDetails };
