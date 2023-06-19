import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Calendar from 'components/calendars/TaskCalendar';
import ReferencesList from 'components/organisms/ReferencesList';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectScheduledTaskIdsByTagNames } from 'reduxStore/slices/tasks/selectors';
import { TagScreenTabParamList } from 'types/base';

const TopTabs = createMaterialTopTabNavigator<TagScreenTabParamList>();

export default function TagNavigator({ tagName }: { tagName: string }) {
  const { t } = useTranslation();
  const taskSelector = useMemo(
    () => selectScheduledTaskIdsByTagNames([tagName]),
    [tagName]
  );
  const filteredTasks = useSelector(taskSelector);

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
    return () => <ReferencesList tags={[tagName]} />;
  }, [tagName]);

  return (
    <TopTabs.Navigator initialRouteName="TagCalendar">
      <TopTabs.Screen
        name="TagCalendar"
        component={calendarComponent}
        options={{
          title: t('pageTitles.calendar')
        }}
      />
      <TopTabs.Screen
        name="TagReferences"
        component={referencesComponent}
        options={{
          title: t('pageTitles.references')
        }}
      />
    </TopTabs.Navigator>
  );
}
