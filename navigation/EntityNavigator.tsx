import Calendar from 'components/calendars/TaskCalendar';
import ListOfLists from 'components/organisms/ListOfLists';
import MessageThread from 'components/organisms/MessageThread';
import ReferencesList from 'components/organisms/ReferencesList';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCategoryById } from 'reduxStore/slices/categories/selectors';
import { selectEntityById } from 'reduxStore/slices/entities/selectors';
import { selectScheduledTaskIdsByEntityIds } from 'reduxStore/slices/tasks/selectors';
import EntityHome from 'screens/EntityPages/EntityHome';
import QuickNavigator from './base/QuickNavigator';

export default function EntityNavigator({ entityId }: { entityId: number }) {
  const taskSelector = useMemo(
    () => selectScheduledTaskIdsByEntityIds([entityId]),
    [entityId]
  );
  const filteredTasks = useSelector(taskSelector);

  const entity = useSelector(selectEntityById(entityId));
  const category = useSelector(selectCategoryById(entity?.category || -1));

  const homeComponent = useMemo(() => {
    return () => <EntityHome entityId={entityId} />;
  }, [entityId]);

  const calendarComponent = useMemo(() => {
    return () => <Calendar showFilters={false} filteredTasks={filteredTasks} />;
  }, [filteredTasks]);

  const referencesComponent = useMemo(() => {
    return () => <ReferencesList entities={[entityId]} />;
  }, [entityId]);

  const listsComponent = useMemo(() => {
    return () => <ListOfLists entityId={entityId} />;
  }, [entityId]);

  const messagesComponent = useMemo(() => {
    return () => <MessageThread entityId={entityId} />;
  }, [entityId]);

  return (
    <QuickNavigator
      homeComponent={homeComponent}
      calendarComponent={calendarComponent}
      referencesComponent={referencesComponent}
      listsComponent={listsComponent}
      messagesComponent={messagesComponent}
      categoryName={category?.name || ''}
      initialRouteName="Calendar"
    />
  );
}
