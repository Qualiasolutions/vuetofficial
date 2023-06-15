import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ContentTabParamList } from 'types/base';
import React from 'react';
import useEntityHeader from '../../../headers/hooks/useEntityHeader';
import EntityListPage from '../../../components/lists/EntityListPage';
import { EntityResponseType } from 'types/entities';

export default function ChildEntitiesScreen({
  route
}: NativeStackScreenProps<ContentTabParamList, 'ChildEntitiesScreen'>) {
  const entityIdRaw = route.params.entityId;
  const entityId =
    typeof entityIdRaw === 'number' ? entityIdRaw : parseInt(entityIdRaw);

  useEntityHeader(entityId);

  return (
    <EntityListPage
      entityTypes={route.params.entityTypes}
      entityTypeName={route.params.entityTypes[0]}
      entityFilters={[(ent: EntityResponseType) => ent.parent === entityId]}
    />
  );
}
