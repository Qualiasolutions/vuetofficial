import React, { useEffect } from 'react';
import {
  EntityTabParamList,
  EntityTabScreenProps,
  RootTabParamList,
  SettingsTabParamList
} from 'types/base';
import { useGetAllCategoriesQuery } from 'reduxStore/services/api/api';
import { TransparentView, WhiteView } from 'components/molecules/ViewComponents';
import { useTranslation } from 'react-i18next';
import ListLink from 'components/molecules/ListLink';
import { FullPageSpinner } from 'components/molecules/Spinners';

const CATEGORY_LINKS = {
  FAMILY: [
    {
      name: 'familyMembers',
      navMethod: 'navigate',
      toScreen: 'SettingsNavigator',
      toScreenParams: { screen: 'FamilySettings' }
    }
  ],
  PETS: [],
  SOCIAL_INTERESTS: [
    {
      name: 'anniversaries',
      toScreen: 'EntityList',
      navMethod: 'push',
      toScreenParams: {
        entityTypes: ['Birthday', 'Anniversary'],
        entityTypeName: 'anniversaries'
      }
    },
    {
      name: 'events',
      toScreen: 'EntityList',
      navMethod: 'push',
      toScreenParams: {
        entityTypes: ['Event'],
        entityTypeName: 'events'
      }
    }
  ],
  EDUCATION_CAREER: [],
  TRAVEL: [],
  HEALTH_BEAUTY: [],
  HOME_GARDEN: [],
  FINANCE: [],
  TRANSPORT: [
    {
      name: 'cars',
      toScreen: 'EntityList',
      navMethod: 'push',
      toScreenParams: {
        entityTypes: ['Car'],
        entityTypeName: 'cars'
      }
    }
  ]
};

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

  const listLinks = CATEGORY_LINKS[categoryData.name]?.map((resourceType) => {
    return (
      <ListLink
        text={t(`linkTitles.${resourceType.name}`)}
        key={resourceType.name}
        navMethod={(resourceType.navMethod || 'push') as 'navigate' | 'push'}
        toScreen={
          resourceType.toScreen as
            | keyof EntityTabParamList
            | keyof RootTabParamList
            | keyof SettingsTabParamList
        }
        toScreenParams={resourceType.toScreenParams}
      />
    );
  });

  return <WhiteView style={{height: '100%'}}>{listLinks}</WhiteView>;
}
