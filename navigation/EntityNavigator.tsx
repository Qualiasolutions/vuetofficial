import Calendar from 'components/calendars/TaskCalendar';
import EditEntityForm from 'components/forms/EditEntityForm';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import MessageThread from 'components/organisms/MessageThread';
import ReferencesList from 'components/organisms/ReferencesList';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCategoryById } from 'reduxStore/slices/categories/selectors';
import { selectMemberEntityById } from 'reduxStore/slices/entities/selectors';
import EntityHome, {
  resourceTypeToComponent
} from 'screens/EntityPages/EntityHome';
import EntityOverview, {
  RESOURCE_TYPE_TO_COMPONENT
} from 'screens/EntityPages/EntityOverview';
import { EntityTypeName } from 'types/entities';
import QuickNavigator, { QuickNavPage } from './base/QuickNavigator';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import GuestListPage from 'components/organisms/GuestListPage';
import useEntityById from 'hooks/entities/useEntityById';
import useTasksForEntityId from 'hooks/tasks/useTasksForEntityId';
import useScheduledEntityIds from 'hooks/entities/useScheduledEntityIds';

const styles = StyleSheet.create({
  editForm: { paddingBottom: 100 }
});

const INITIAL_ROUTE_NAME_MAPPINGS: { [key in EntityTypeName]?: string } = {
  List: 'Home',
  Event: 'Overview'
};

export default function EntityNavigator({ entityId }: { entityId: number }) {
  const { t } = useTranslation();
  // const filteredTasks = useTasksForEntityId(entityId);
  // const navigation = useNavigation();

  const entity = useEntityById(entityId);
  const category = useSelector(selectCategoryById(entity?.category || -1));

  const isMemberEntity = !!useSelector(selectMemberEntityById(entityId));

  // const filteredEntities = useScheduledEntityIds(undefined, entityId);

  // const homeComponent = useMemo(() => {
  //   if (
  //     entity &&
  //     resourceTypeToComponent[entity?.resourcetype] &&
  //     isMemberEntity
  //   ) {
  //     return () => <EntityHome entityId={entityId} />;
  //   }
  //   return null;
  // }, [entity, entityId, isMemberEntity]);

  // const editComponent = useMemo(() => {
  //   return () => (
  //     <TransparentFullPageScrollView contentContainerStyle={styles.editForm}>
  //       <EditEntityForm
  //         entityId={entityId}
  //         onSubmitSuccess={() => {
  //           navigation.goBack();
  //         }}
  //       />
  //     </TransparentFullPageScrollView>
  //   );
  // }, [entityId, navigation]);

  // const overviewComponent = useMemo(() => {
  //   if (entity && entity?.resourcetype in RESOURCE_TYPE_TO_COMPONENT) {
  //     return () => <EntityOverview entityId={entityId} />;
  //   }
  //   return null;
  // }, [entityId, entity]);

  // const calendarComponent = useMemo(() => {
  //   return () => (
  //     <Calendar
  //       showFilters={false}
  //       filteredTasks={filteredTasks}
  //       filteredEntities={filteredEntities}
  //     />
  //   );
  // }, [filteredTasks, filteredEntities]);

  // const referencesComponent = useMemo(() => {
  //   if (isMemberEntity) {
  //     return () => <ReferencesList entities={[entityId]} />;
  //   }
  //   return null;
  // }, [entityId, isMemberEntity]);

  // const messagesComponent = useMemo(() => {
  //   if (isMemberEntity) {
  //     return () => <MessageThread entityId={entityId} />;
  //   }
  //   return null;
  // }, [entityId, isMemberEntity]);

  // const guestListComponent = useMemo(() => {
  //   if (entity && isMemberEntity) {
  //     if (entity.resourcetype === 'Event')
  //       return () => <GuestListPage entityId={entityId} />;
  //   }
  //   return null;
  // }, [entity, entityId, isMemberEntity]);

  const quickNavPages: QuickNavPage[] = useMemo(() => {
    let pages = [];

    // if (homeComponent) {
    //   pages.push({
    //     name: 'Home',
    //     title: t('pageTitles.home'),
    //     component: homeComponent
    //   });
    // }
    // if (editComponent) {
    //   pages.push({
    //     name: 'Edit',
    //     title: t('pageTitles.edit'),
    //     component: editComponent
    //   });
    // }
    // if (overviewComponent) {
    //   pages.push({
    //     name: 'Overview',
    //     title: t('pageTitles.overview'),
    //     component: overviewComponent
    //   });
    // }
    // if (calendarComponent) {
    //   pages.push({
    //     name: 'Calendar',
    //     title: t('pageTitles.calendar'),
    //     component: calendarComponent
    //   });
    // }
    // if (referencesComponent) {
    //   pages.push({
    //     name: 'References',
    //     title: t('pageTitles.references'),
    //     component: referencesComponent
    //   });
    // }
    // if (messagesComponent) {
    //   pages.push({
    //     name: 'Messages',
    //     title: t('pageTitles.messages'),
    //     component: messagesComponent
    //   });
    // }
    // if (guestListComponent) {
    //   pages.push({
    //     name: 'GuestList',
    //     title: t('pageTitles.guestList'),
    //     component: guestListComponent
    //   });
    // }

    return pages;
  }, [
    // homeComponent,
    // calendarComponent,
    // editComponent,
    // guestListComponent,
    // messagesComponent,
    // overviewComponent,
    // referencesComponent,
    t
  ]);

  return (
    <QuickNavigator
      categoryName={category?.name || ''}
      initialRouteName={
        entity?.resourcetype
          ? INITIAL_ROUTE_NAME_MAPPINGS[entity?.resourcetype] || 'Calendar'
          : 'Calendar'
      }
      quickNavPages={quickNavPages}
    />
  );
}
