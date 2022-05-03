import { SET_ALL_CATEGORIES } from './actionNames';

import { Category } from 'types/categories';

import { createAction } from 'typesafe-actions';

const setAllCategories = createAction(SET_ALL_CATEGORIES)<Category[]>();

export { setAllCategories };
