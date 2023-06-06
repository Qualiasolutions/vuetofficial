import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ContentTabParamList } from 'types/base';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ListEntityPage from './components/ListEntityPage';
import BirthdayPage from './components/BirthdayPage';
import HobbyPage from './components/HobbyPage';
import SchoolPage from './components/SchoolPage';
import TripPage from './components/TripPage';
import EventPage from './components/EventPage';
import HolidayPage from './components/HolidayPage';
import useEntityHeader from '../../../headers/hooks/useEntityHeader';
import EntityNavigator from 'navigation/EntityNavigator';
import { selectEntityById } from 'reduxStore/slices/entities/selectors';

const DefaultEntityPage = ({ entityId }: { entityId: number }) => {
  return <EntityNavigator entityId={entityId} />;
};

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
}: NativeStackScreenProps<ContentTabParamList, 'EntityScreen'>) {
  const entityIdRaw = route.params.entityId;
  const entityId =
    typeof entityIdRaw === 'number' ? entityIdRaw : parseInt(entityIdRaw);
  const entity = useSelector(selectEntityById(entityId));

  useEntityHeader(entityId);
  useEffect(() => {
    if (!entity) {
      navigation.goBack();
    }
  }, [entity, navigation]);

  if (!entity) {
    return null;
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
