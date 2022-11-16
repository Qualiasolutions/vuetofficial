import React from 'react';
import { EntityTabScreenProps } from 'types/base';
import EntityListPage from '../../components/lists/EntityListPage';
import useEntityTypeHeader from 'headers/hooks/useEntityTypeHeader';

type EntityListScreenProps = EntityTabScreenProps<'EntityList'>;

export default function EntityListScreen({ route }: EntityListScreenProps) {
  useEntityTypeHeader(route.params.entityTypeName);
  return (
    <EntityListPage
      entityTypes={route.params.entityTypes}
      entityTypeName={route.params.entityTypeName}
    />
  );
}
