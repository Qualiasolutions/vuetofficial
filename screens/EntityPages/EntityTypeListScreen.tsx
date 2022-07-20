import React, { useEffect } from 'react';
import { EntityTabScreenProps } from 'types/base';
import { useGetAllCategoriesQuery } from 'reduxStore/services/api/api';
import { TransparentView } from 'components/molecules/ViewComponents';
import { useTranslation } from 'react-i18next';
import ListLink from 'components/molecules/ListLink';

type EntityTypeListScreenProps = EntityTabScreenProps<'EntityTypeList'>;

export default function EntityTypeListScreen({
  navigation,
  route
}: EntityTypeListScreenProps) {
  const { data: allCategories, isLoading, error } = useGetAllCategoriesQuery();
  const categoryData = allCategories?.byId[route.params.categoryId];
  const permittedResourceTypes = categoryData?.model_types?.map(
    (type) => type.model_name
  );

  const { t } = useTranslation();

  useEffect(() => {
    navigation.setOptions({
      title: t(`categories.${categoryData?.name}`)
    });
  }, [allCategories]);

  const listLinks = permittedResourceTypes?.map((resourceType) => {
    return (
      <ListLink
        text={t(`entityTypes.${resourceType}`)}
        key={resourceType}
        navMethod="push"
        toScreen="EntityList"
        toScreenParams={{ entityType: resourceType }}
      />
    );
  });

  return <TransparentView>{listLinks}</TransparentView>;
}
