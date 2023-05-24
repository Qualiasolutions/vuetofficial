import React from 'react';
import { EntityTabScreenProps } from 'types/base';
import annualDates from './linkConfigs/annualDates';
import career from './linkConfigs/career';
import education from './linkConfigs/education';
import LinkList from 'components/lists/LinkList';
import useEntityTypeHeader from 'headers/hooks/useEntityTypeHeader';

type LinkListScreenProps = EntityTabScreenProps<'LinkList'>;

const listNameToLinks = {
  annualDates,
  career,
  education
};

export default function LinkListScreen({ route }: LinkListScreenProps) {
  useEntityTypeHeader(route.params.listName);

  return <LinkList links={listNameToLinks[route.params.listName]} />;
}
