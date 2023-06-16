import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Calendar from 'components/calendars/TaskCalendar';
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

  return (
    <TopTabs.Navigator initialRouteName="TagCalendar">
      <TopTabs.Screen
        name="TagCalendar"
        component={calendarComponent}
        options={{
          title: t('pageTitles.calendar')
        }}
      />
    </TopTabs.Navigator>
  );
}
