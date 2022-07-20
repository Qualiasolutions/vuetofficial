import React, { useEffect } from 'react';
import { Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { RootTabScreenProps } from 'types/base';
import { useGetAllCategoriesQuery } from 'reduxStore/services/api/api';
import { TransparentView, WhiteView } from 'components/molecules/ViewComponents';
import { AlmostBlackText } from 'components/molecules/TextComponents';
import { useTranslation } from 'react-i18next';
import ListLink from 'components/molecules/ListLink';

type EntityTypeListScreenProps = RootTabScreenProps<'EntityTypeList'>;

export default function EntityTypeListScreen({ navigation, route }: EntityTypeListScreenProps) {
  const { data: allCategories, isLoading, error } = useGetAllCategoriesQuery()
  const categoryData = allCategories?.byId[route.params.categoryId]
  const permittedResourceTypes = categoryData?.model_types?.map(type => type.model_name)

  const { t } = useTranslation()

  useEffect(() => {
    navigation.setOptions({
      title: t(`categories.${categoryData?.name}`)
    });
  }, [allCategories]);

  const listLinks = permittedResourceTypes?.map(resourceType => (
    <ListLink
      text={t(`entityTypes.${resourceType}`)}
      key={resourceType}
      toScreen='EntityList'
      toScreenParams={{ entityType: resourceType }}
    />
  ))

  return (
    <TransparentView>
      {listLinks}
    </TransparentView>
  );
}
