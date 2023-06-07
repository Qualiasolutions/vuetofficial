import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Calendar from 'components/calendars/TaskCalendar';
import EntityListPage from 'components/lists/EntityListPage';
import ReferencesList from 'components/organisms/ReferencesList';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectScheduledTaskIdsByEntityTypes } from 'reduxStore/slices/calendars/selectors';
import { EntityTabParamList } from 'types/base';
import { EntityTypeName } from 'types/entities';

const TopTabs = createMaterialTopTabNavigator<EntityTabParamList>();

export default function EntityTypeNavigator({
  entityTypes,
  entityTypeName
}: {
  entityTypes: EntityTypeName[];
  entityTypeName: string;
}) {
  const taskSelector = useMemo(
    () => selectScheduledTaskIdsByEntityTypes(entityTypes),
    [entityTypes]
  );
  const filteredTasks = useSelector(taskSelector);

  const homeComponent = useMemo(() => {
    return () => (
      <EntityListPage
        entityTypes={entityTypes}
        entityTypeName={entityTypeName}
      />
    );
  }, [entityTypes, entityTypeName]);

  const calendarComponent = useMemo(() => {
    return () => (
      <Calendar
        fullPage={false}
        showFilters={false}
        filteredTasks={filteredTasks}
      />
    );
  }, [filteredTasks]);

  const referencesComponent = useMemo(() => {
    return () => <ReferencesList />;
    // return () => <ReferencesList entities={[entityTypes]} />;
  }, [entityTypes]);

  return (
    <TopTabs.Navigator initialRouteName="Home">
      <TopTabs.Screen name="Home" component={homeComponent} />
      <TopTabs.Screen name="Calendar" component={calendarComponent} />
      <TopTabs.Screen name="References" component={referencesComponent} />
    </TopTabs.Navigator>
  );
}
