import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Calendar from 'components/calendars/TaskCalendar';
import ReferencesList from 'components/organisms/ReferencesList';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectScheduledTaskIdsByEntityIds } from 'reduxStore/slices/tasks/selectors';
import { EntityTabParamList } from 'types/base';

const TopTabs = createMaterialTopTabNavigator<EntityTabParamList>();

export default function EntityNavigator({ entityId }: { entityId: number }) {
  const { t } = useTranslation();
  const taskSelector = useMemo(
    () => selectScheduledTaskIdsByEntityIds([entityId]),
    [entityId]
  );
  const filteredTasks = useSelector(taskSelector);

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
    <TopTabs.Navigator initialRouteName="EntityHome">
      <TopTabs.Screen
        name="EntityHome"
        component={homeComponent}
        options={{
          title: t('pageTitles.home')
        }}
      />
      <TopTabs.Screen
        name="EntityCalendar"
        component={calendarComponent}
        options={{
          title: t('pageTitles.calendar')
        }}
      />
      <TopTabs.Screen
        name="EntityReferences"
        component={referencesComponent}
        options={{
          title: t('pageTitles.references')
        }}
      />
    </TopTabs.Navigator>
  );
}
