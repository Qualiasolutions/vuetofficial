import { NativeStackScreenProps } from '@react-navigation/native-stack';
import GenericError from 'components/molecules/GenericError';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { EntityTabParamList } from 'types/base';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import ListEntityPage from './components/ListEntityPage';
import ChildEntityList from './components/ChildEntityList';
import BirthdayPage from './components/BirthdayPage';
import HobbyPage from './components/HobbyPage';

const resourceTypeToComponent = {
  List: ListEntityPage,
  Birthday: BirthdayPage,
  Hobby: HobbyPage,
  default: ChildEntityList
} as {
  default: React.ElementType,
  [key: string]: React.ElementType | undefined
}

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

  const Screen: React.ElementType | undefined = resourceTypeToComponent[entity.resourcetype]
  const DefaultScreen: React.ElementType = resourceTypeToComponent.default
  return Screen ?
    <Screen entityId={entityId} /> :
    <DefaultScreen entityId={entityId} />
}
