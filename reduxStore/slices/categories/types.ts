import { Category } from 'types/categories'

type AllCategories = {
  ids: number[];
  byId: {
    [id: number]: Category;
  };
};

type CategoriesState = {
  allCategories: AllCategories;
};

export { AllCategories, CategoriesState };
