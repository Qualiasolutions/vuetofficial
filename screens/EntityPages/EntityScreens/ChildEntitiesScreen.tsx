import { NativeStackScreenProps } from '@react-navigation/native-stack';
import GenericError from 'components/molecules/GenericError';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { EntityTabParamList } from 'types/base';
import React from 'react';
import useGetUserDetails from 'hooks/useGetUserDetails';
import useEntityHeader from '../../../headers/hooks/useEntityHeader';
import EntityListPage from '../../../components/lists/EntityListPage';
import { EntityResponseType } from 'types/entities';

export default function ChildEntitiesScreen({
  navigation,
  route
}: NativeStackScreenProps<EntityTabParamList, 'ChildEntitiesScreen'>) {
  const { data: userDetails } = useGetUserDetails();

  const {
    data: allEntities,
    isLoading: isLoadingEntities,
    error: entitiesError
  } = useGetAllEntitiesQuery(userDetails?.id || -1);

  const entityIdRaw = route.params.entityId;
  const entityId =
    typeof entityIdRaw === 'number' ? entityIdRaw : parseInt(entityIdRaw);
  const entity = allEntities?.byId[entityId];

  useEntityHeader(entityId);

  const isLoading = isLoadingEntities;

  if (isLoading || !entity) {
    return null;
  }

  if (entitiesError) {
    return <GenericError />;
  }

  return (
    <EntityListPage
      entityTypes={route.params.entityTypes}
      entityTypeName={route.params.entityTypes[0]}
      entityFilters={[(ent: EntityResponseType) => ent.parent === entityId]}
    />
  );
}
