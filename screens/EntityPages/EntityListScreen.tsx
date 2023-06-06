import React from 'react';
import { ContentTabScreenProps } from 'types/base';
import useEntityTypeHeader from 'headers/hooks/useEntityTypeHeader';
import EntityTypeNavigator from 'navigation/EntityTypeNavigator';

type EntityListScreenProps = ContentTabScreenProps<'EntityList'>;

export default function EntityListScreen({ route }: EntityListScreenProps) {
  useEntityTypeHeader(route.params.entityTypeName);
  return (
    <EntityTypeNavigator
      entityTypes={route.params.entityTypes}
      entityTypeName={route.params.entityTypeName}
    />
  );
}
