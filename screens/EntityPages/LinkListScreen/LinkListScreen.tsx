import React from 'react';
import { EntityTabScreenProps } from 'types/base';
import annualDates from './linkConfigs/annualDates';
import LinkList from './components/LinkList';
import { useTranslation } from 'react-i18next';

type EntityTypeListScreenProps = EntityTabScreenProps<'LinkList'>;

const listNameToLinks = {
  annualDates
};

export default function LinkListScreen({
  navigation,
  route
}: EntityTypeListScreenProps) {
  const { t } = useTranslation();

  navigation.setOptions({
    headerTitle: t(`linkListTitles.${route.params.listName}`)
  });
  
  return <LinkList links={listNameToLinks[route.params.listName]} />;
}
