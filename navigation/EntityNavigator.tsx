import Calendar from 'components/calendars/TaskCalendar';
import EditEntityForm from 'components/forms/EditEntityForm';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
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
import EntityHome, {
  resourceTypeToComponent
} from 'screens/EntityPages/EntityHome';
import EntityOverview, {
  RESOURCE_TYPE_TO_COMPONENT
} from 'screens/EntityPages/EntityOverview';
import { EntityTypeName } from 'types/entities';
import QuickNavigator from './base/QuickNavigator';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  editForm: { paddingBottom: 100 }
});

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
    if (
      entity &&
      resourceTypeToComponent[entity?.resourcetype] &&
      isMemberEntity
    ) {
      return () => <EntityHome entityId={entityId} />;
    }
    return null;
  }, [entity, entityId, isMemberEntity]);

  const editComponent = useMemo(() => {
    if (entity && resourceTypeToComponent[entity?.resourcetype]) {
      return null;
    }
    if (!isMemberEntity) {
      return null;
    }
    return () => (
      <TransparentFullPageScrollView contentContainerStyle={styles.editForm}>
        <EditEntityForm entityId={entityId} />
      </TransparentFullPageScrollView>
    );
  }, [entity, isMemberEntity, entityId]);

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
      editComponent={editComponent}
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
