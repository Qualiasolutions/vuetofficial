import React, { useEffect } from 'react';
import { EntityTabScreenProps } from 'types/base';
import annualDates from './linkConfigs/annualDates';
import career from './linkConfigs/career';
import education from './linkConfigs/education';
import LinkList from './components/LinkList';
import { useTranslation } from 'react-i18next';

type EntityTypeListScreenProps = EntityTabScreenProps<'LinkList'>;

const listNameToLinks = {
  annualDates,
  career,
  education
};

export default function LinkListScreen({
  navigation,
  route
}: EntityTypeListScreenProps) {
  const { t } = useTranslation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: t(`linkListTitles.${route.params.listName}`)
    });
  }, [route]);

  return <LinkList links={listNameToLinks[route.params.listName]} />;
}
