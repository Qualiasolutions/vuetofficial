import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import EntityCalendarPage from 'components/calendars/EntityCalendarPage';
import ReferencesList from 'components/organisms/ReferencesList';
import { useMemo } from 'react';
import { EntityTabParamList } from 'types/base';

const TopTabs = createMaterialTopTabNavigator<EntityTabParamList>();

export default function EntityNavigator({ entityId }: { entityId: number }) {
  const homeComponent = useMemo(() => {
    return () => null;
  }, [entityId]);

  const calendarComponent = useMemo(() => {
    return () => <EntityCalendarPage entityIds={[entityId]} />;
  }, [entityId]);

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
