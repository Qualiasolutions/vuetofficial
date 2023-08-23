import Calendar from 'components/calendars/TaskCalendar';
import MessageThread from 'components/organisms/MessageThread';
import ReferencesList from 'components/organisms/ReferencesList';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCategoryById } from 'reduxStore/slices/categories/selectors';
import {
  selectEntityById,
  selectMemberEntityById
} from 'reduxStore/slices/entities/selectors';
import {
  selectFilteredScheduledEntityIds,
  selectScheduledTaskIdsByEntityIds
} from 'reduxStore/slices/tasks/selectors';
import EntityHome from 'screens/EntityPages/EntityHome';
import EntityOverview, {
  RESOURCE_TYPE_TO_COMPONENT
} from 'screens/EntityPages/EntityOverview';
import { EntityTypeName } from 'types/entities';
import QuickNavigator from './base/QuickNavigator';

const INITIAL_ROUTE_NAME_MAPPINGS: { [key in EntityTypeName]?: string } = {
  List: 'Home',
  Event: 'Overview'
};
export default function EntityNavigator({ entityId }: { entityId: number }) {
  const taskSelector = useMemo(
    () => selectScheduledTaskIdsByEntityIds([entityId]),
    [entityId]
  );
  const filteredTasks = useSelector(taskSelector);

  const entity = useSelector(selectEntityById(entityId));
  const category = useSelector(selectCategoryById(entity?.category || -1));

  const isMemberEntity = !!useSelector(selectMemberEntityById(entityId));

  const filteredEntities = useSelector(
    selectFilteredScheduledEntityIds(undefined, [entityId])
  );

  const homeComponent = useMemo(() => {
    if (isMemberEntity) {
      return () => <EntityHome entityId={entityId} />;
    }
    return null;
  }, [entityId, isMemberEntity]);

  const overviewComponent = useMemo(() => {
    if (entity && entity?.resourcetype in RESOURCE_TYPE_TO_COMPONENT) {
      return () => <EntityOverview entityId={entityId} />;
    }
    return null;
  }, [entityId, entity]);

  const calendarComponent = useMemo(() => {
    return () => (
      <Calendar
        showFilters={false}
        filteredTasks={filteredTasks}
        filteredEntities={filteredEntities}
      />
    );
  }, [filteredTasks, filteredEntities]);

  const referencesComponent = useMemo(() => {
    if (isMemberEntity) {
      return () => <ReferencesList entities={[entityId]} />;
    }
    return null;
  }, [entityId, isMemberEntity]);

  // const listsComponent = useMemo(() => {
  //   return () => <ListOfLists entities={[entityId]} />;
  // }, [entityId]);

  const messagesComponent = useMemo(() => {
    if (isMemberEntity) {
      return () => <MessageThread entityId={entityId} />;
    }
    return null;
  }, [entityId, isMemberEntity]);

  return (
    <QuickNavigator
      homeComponent={homeComponent}
      overviewComponent={overviewComponent}
      calendarComponent={calendarComponent}
      referencesComponent={referencesComponent}
      // listsComponent={listsComponent}
      messagesComponent={messagesComponent}
      categoryName={category?.name || ''}
      initialRouteName={
        entity?.resourcetype
          ? INITIAL_ROUTE_NAME_MAPPINGS[entity?.resourcetype] || 'Calendar'
          : 'Calendar'
      }
    />
  );
}
