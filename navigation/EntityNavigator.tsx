import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Calendar from 'components/calendars/TaskCalendar';
import ReferencesList from 'components/organisms/ReferencesList';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectScheduledTaskIdsByEntityIds } from 'reduxStore/slices/calendars/selectors';
import { EntityTabParamList } from 'types/base';

const TopTabs = createMaterialTopTabNavigator<EntityTabParamList>();

export default function EntityNavigator({ entityId }: { entityId: number }) {
  const filteredTasks = useSelector(
    selectScheduledTaskIdsByEntityIds([entityId])
  );

  const homeComponent = useMemo(() => {
    return () => null;
  }, [entityId]);

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
    return () => <ReferencesList entities={[entityId]} />;
  }, [entityId]);

  return (
    <TopTabs.Navigator initialRouteName="Home">
      <TopTabs.Screen name="Home" component={homeComponent} />
      <TopTabs.Screen name="Calendar" component={calendarComponent} />
      <TopTabs.Screen name="References" component={referencesComponent} />
    </TopTabs.Navigator>
  );
}
