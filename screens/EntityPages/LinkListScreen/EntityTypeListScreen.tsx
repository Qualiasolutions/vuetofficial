import React, { useEffect } from 'react';
import { EntityTabScreenProps } from 'types/base';
import { useGetAllCategoriesQuery } from 'reduxStore/services/api/api';
import { useTranslation } from 'react-i18next';
import { FullPageSpinner } from 'components/molecules/Spinners';
import { StyleSheet } from 'react-native';
import linkConfig from './linkConfigs/subCategories';
import LinkList from '../../../components/lists/LinkList';

type EntityTypeListScreenProps = EntityTabScreenProps<'EntityTypeList'>;

export default function EntityTypeListScreen({
  navigation,
  route
}: EntityTypeListScreenProps) {
  const { data: allCategories, isLoading, error } = useGetAllCategoriesQuery();
  const categoryData = allCategories?.byId[route.params.categoryId];

  const { t } = useTranslation();

  useEffect(() => {
    if (categoryData) {
      navigation.setOptions({
        title: t(`categories.${categoryData.name as string}`)
      });
    }
  }, [allCategories]);

  if (!categoryData) {
    return <FullPageSpinner />;
  }

  return <LinkList links={linkConfig[categoryData.name]} />;
}
