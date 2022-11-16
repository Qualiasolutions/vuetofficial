import React, { useEffect } from 'react';
import { EntityTabScreenProps } from 'types/base';
import annualDates from './linkConfigs/annualDates';
import career from './linkConfigs/career';
import education from './linkConfigs/education';
import LinkList from '../../../components/lists/LinkList';
import { useTranslation } from 'react-i18next';
import useEntityTypeHeader from 'headers/hooks/useEntityTypeHeader';

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

  useEntityTypeHeader(route.params.listName);

  return <LinkList links={listNameToLinks[route.params.listName]} />;
}
