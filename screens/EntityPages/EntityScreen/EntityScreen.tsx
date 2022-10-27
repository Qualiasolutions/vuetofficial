import { NativeStackScreenProps } from '@react-navigation/native-stack';
import GenericError from 'components/molecules/GenericError';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { EntityTabParamList } from 'types/base';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import ListEntityPage from './components/ListEntityPage';
import BirthdayPage from './components/BirthdayPage';
import HobbyPage from './components/HobbyPage';
import SchoolPage from './components/SchoolPage';
import TripPage from './components/TripPage';
import EventPage from './components/EventPage';
import HolidayPage from './components/HolidayPage';
import EntityCalendarPage from './components/EntityCalendarPage';
import useEntityHeader from './headers/useEntityHeader';
import { PaddedSpinner } from 'components/molecules/Spinners';

const DefaultEntityPage = ( { entityId }: { entityId: number }) => {
  return <EntityCalendarPage entityIds={[entityId]}/>
}

const resourceTypeToComponent = {
  List: ListEntityPage,
  Birthday: BirthdayPage,
  Hobby: HobbyPage,
  Trip: TripPage,
  Event: EventPage,
  Holiday: HolidayPage,
  School: SchoolPage,
  default: DefaultEntityPage
} as {
  default: React.ElementType;
  [key: string]: React.ElementType | undefined;
};

export default function EntityScreen({
  navigation,
  route
}: NativeStackScreenProps<EntityTabParamList, 'EntityScreen'>) {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const {
    data: allEntities,
    isLoading: isLoadingEntities,
    isFetching: isFetchingEntities,
    error: entitiesError
  } = useGetAllEntitiesQuery(userDetails?.user_id || -1);

  const entityIdRaw = route.params.entityId;
  const entityId =
    typeof entityIdRaw === 'number' ? entityIdRaw : parseInt(entityIdRaw);
  const entity = allEntities?.byId[entityId];

  useEntityHeader(entityId);

  useEffect(() => {
    if (allEntities && !entity) {
      navigation.goBack();
    }
  }, [entity]);

  if (isLoadingEntities || isFetchingEntities) {
    return <PaddedSpinner />;
  }

  if (!entity) {
    return null;
  }

  if (entitiesError) {
    return <GenericError />;
  }

  const Screen: React.ElementType | undefined =
    resourceTypeToComponent[entity.resourcetype];
  const DefaultScreen: React.ElementType = resourceTypeToComponent.default;

  return Screen ? (
    <Screen entityId={entityId} />
  ) : (
    <DefaultScreen entityId={entityId} />
  );
}
