import { NativeStackScreenProps } from '@react-navigation/native-stack';
import GenericError from 'components/molecules/GenericError';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { EntityTabParamList } from 'types/base';
import React, { useEffect } from 'react';
import ChildEntityList from './components/ChildEntityList';
import useGetUserDetails from 'hooks/useGetUserDetails';

export default function EntityScreen({
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

  useEffect(() => {
    navigation.setOptions({
      headerTitle: entity?.name
    });
  }, [entity]);

  const isLoading = isLoadingEntities;

  if (isLoading || !entity) {
    return null;
  }

  if (entitiesError) {
    return <GenericError />;
  }

  return <ChildEntityList entityId={entityId} entityTypes={route.params.entityTypes}/>
}
