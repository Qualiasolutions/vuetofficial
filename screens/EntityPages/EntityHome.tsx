import React from 'react';
import { useSelector } from 'react-redux';
import ListEntityPage from './EntityScreens/components/ListEntityPage';
// import BirthdayPage from './EntityScreens/components/BirthdayPage';
// import SchoolPage from './EntityScreens/components/SchoolPage';
// import TripPage from './EntityScreens/components/TripPage';
// import EventPage from './EntityScreens/components/EventPage';
// import HolidayPage from './EntityScreens/components/HolidayPage';
import { selectEntityById } from 'reduxStore/slices/entities/selectors';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import EditEntityForm from 'components/forms/EditEntityForm';
import { StyleSheet } from 'react-native';
import CarPage from './EntityScreens/components/CarPage';

const styles = StyleSheet.create({
  editForm: { paddingBottom: 100 }
});

const DefaultHome = ({ entityId }: { entityId: number }) => {
  return (
    <TransparentFullPageScrollView contentContainerStyle={styles.editForm}>
      <EditEntityForm entityId={entityId} />
    </TransparentFullPageScrollView>
  );
};

export const resourceTypeToComponent = {
  List: ListEntityPage,
  Car: CarPage,
  default: DefaultHome
} as {
  default: React.ElementType;
  [key: string]: React.ElementType | undefined;
};

export default function EntityHome({ entityId }: { entityId: number }) {
  const entity = useSelector(selectEntityById(entityId));
  const resourceType = entity?.resourcetype;

  if (!resourceType) {
    return null;
  }

  const Comp =
    resourceTypeToComponent[resourceType] || resourceTypeToComponent.default;

  return <Comp entityId={entityId} />;
}
