import { Selector } from 'react-redux';
import { CategoriesState } from './types';
import { EntireState } from '../../types';
import { createSelector } from '@reduxjs/toolkit';
import { AllCategories } from './types';

export const selectAuthState = (state: EntireState): CategoriesState => state.categories;

export const selectAllCategories: Selector<EntireState, AllCategories> = createSelector(
  selectAuthState,
  (categories: CategoriesState) => categories.allCategories
);
