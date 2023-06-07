import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Calendar from 'components/calendars/TaskCalendar';
import CategoryHome from 'components/organisms/CategoryHome';
import ReferencesList from 'components/organisms/ReferencesList';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectScheduledTaskIdsByCategories } from 'reduxStore/slices/calendars/selectors';
import { CategoryTabParamList } from 'types/base';

const TopTabs = createMaterialTopTabNavigator<CategoryTabParamList>();

export default function CategoryNavigator({
  categoryId
}: {
  categoryId: number;
}) {
  const taskSelector = useMemo(
    () => selectScheduledTaskIdsByCategories([categoryId]),
    [categoryId]
  );
  const filteredTasks = useSelector(taskSelector);

  const homeComponent = useMemo(() => {
    return () => <CategoryHome categoryId={categoryId} />;
  }, [categoryId]);

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
    return () => <ReferencesList categories={[categoryId]} />;
  }, [categoryId]);

  return (
    <TopTabs.Navigator initialRouteName="Home">
      <TopTabs.Screen name="Home" component={homeComponent} />
      <TopTabs.Screen name="Calendar" component={calendarComponent} />
      <TopTabs.Screen name="References" component={referencesComponent} />
    </TopTabs.Navigator>
  );
}
