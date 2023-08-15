import Calendar from 'components/calendars/TaskCalendar';
import CategoryHome from 'components/organisms/CategoryHome';
import ListOfLists from 'components/organisms/ListOfLists';
import ListsNavigator from 'components/organisms/ListsNavigator';
import ReferencesList from 'components/organisms/ReferencesList';
import { Text } from 'components/Themed';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useGetAllReferenceGroupsQuery } from 'reduxStore/services/api/references';
import { selectCategoryById } from 'reduxStore/slices/categories/selectors';
import { selectScheduledTaskIdsByCategories } from 'reduxStore/slices/tasks/selectors';
import QuickNavigator from './base/QuickNavigator';

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
  const category = useSelector(selectCategoryById(categoryId));

  const homeComponent = useMemo(() => {
    return () => <CategoryHome categoryId={categoryId} />;
  }, [categoryId]);

  const calendarComponent = useMemo(() => {
    return () => <Calendar showFilters={false} filteredTasks={filteredTasks} />;
  }, [filteredTasks]);

  const referencesComponent = useMemo(() => {
    return () => <ReferencesList categories={[categoryId]} />;
  }, [categoryId]);

  // const listsComponent = useMemo(() => {
  //   return () => <ListOfLists categories={[categoryId]} />;
  // }, [categoryId]);

  return (
    <QuickNavigator
      homeComponent={homeComponent}
      calendarComponent={calendarComponent}
      referencesComponent={referencesComponent}
      // listsComponent={listsComponent}
      categoryName={category?.name || ''}
    />
  );
}
