import { createSelector } from '@reduxjs/toolkit';
import { vuetApi } from 'reduxStore/services/api/api';

export const selectCategoryById = (categoryId: number) =>
  createSelector(vuetApi.endpoints.getAllCategories.select(), (categories) => {
    const categoryData = categories?.data;
    if (!categoryData) {
      return null;
    }
    return categoryData.byId[categoryId];
  });
