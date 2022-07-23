import { NativeStackScreenProps } from '@react-navigation/native-stack';
import GenericError from 'components/molecules/GenericError';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { EntityTabParamList } from 'types/base';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import ListEntityScreen from './components/ListEntityScreen';
import ChildEntityListScreen from './components/ChildEntityListScreen';
import BirthdayScreen from './components/BirthdayScreen';

export default function EntityScreen({
  navigation,
  route
}: NativeStackScreenProps<EntityTabParamList, 'EntityScreen'>) {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const {
    data: allEntities,
    isLoading: isLoadingEntities,
    error: entitiesError
  } = useGetAllEntitiesQuery(userDetails?.user_id || -1);

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

  if (entity.resourcetype === 'List') {
    return <ListEntityScreen entityId={entityId} />;
  } else if (entity.resourcetype === 'Birthday') {
    return <BirthdayScreen entityId={entityId} />;
  } else {
    return <ChildEntityListScreen entityId={entityId} />;
  }
}
