import React from 'react';
import { ContentTabScreenProps } from 'types/base';
import annualDates from './linkConfigs/annualDates';
import anniversaries from './linkConfigs/anniversaries';
import holidays from './linkConfigs/holidays';
import LinkList from 'components/lists/LinkList';
import useEntityTypeHeader from 'headers/hooks/useEntityTypeHeader';

type LinkListScreenProps = ContentTabScreenProps<'LinkList'>;

const listNameToLinks = {
  annualDates,
  anniversaries,
  holidays
};

export default function LinkListScreen({ route }: LinkListScreenProps) {
  useEntityTypeHeader(route.params.listName);

  return <LinkList links={listNameToLinks[route.params.listName]} />;
}
