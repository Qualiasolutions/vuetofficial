import React from 'react';
import { ContentTabScreenProps } from 'types/base';
import CategoryNavigator from 'navigation/CategoryNavigator';
import { useSelector } from 'react-redux';
import { selectCategoryById } from 'reduxStore/slices/categories/selectors';
import useEntityTypeHeader from 'headers/hooks/useEntityTypeHeader';

type CategoryListScreenProps = ContentTabScreenProps<'CategoryList'>;

export default function CategoryListScreen({ route }: CategoryListScreenProps) {
  const category = useSelector(selectCategoryById(route.params.categoryId));
  useEntityTypeHeader(category?.name || '');

  return <CategoryNavigator categoryId={route.params.categoryId} />;
}
