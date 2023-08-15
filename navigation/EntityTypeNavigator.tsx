import Calendar from 'components/calendars/TaskCalendar';
import EntityListPage from 'components/lists/EntityListPage';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import ListOfLists from 'components/organisms/ListOfLists';
import ListsNavigator from 'components/organisms/ListsNavigator';
import ReferencesList from 'components/organisms/ReferencesList';
import ENTITY_TYPE_TO_CATEGORY from 'constants/EntityTypeToCategory';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectScheduledTaskIdsByEntityTypes } from 'reduxStore/slices/tasks/selectors';
import { EntityTypeName } from 'types/entities';
import QuickNavigator from './base/QuickNavigator';

export default function EntityTypeNavigator({
  entityTypes,
  entityTypeName
}: {
  entityTypes: EntityTypeName[];
  entityTypeName: string;
}) {
  const taskSelector = useMemo(
    () => selectScheduledTaskIdsByEntityTypes(entityTypes),
    [entityTypes]
  );
  const filteredTasks = useSelector(taskSelector);

  const homeComponent = useMemo(() => {
    return () => (
      <TransparentFullPageScrollView>
        <EntityListPage
          entityTypes={entityTypes}
          entityTypeName={entityTypeName}
        />
      </TransparentFullPageScrollView>
    );
  }, [entityTypes, entityTypeName]);

  const calendarComponent = useMemo(() => {
    return () => <Calendar showFilters={false} filteredTasks={filteredTasks} />;
  }, [filteredTasks]);

  const referencesComponent = useMemo(() => {
    return () => <ReferencesList entityTypes={entityTypes} />;
  }, [entityTypes]);

  // const listsComponent = useMemo(() => {
  //   return () => <ListOfLists entityTypes={entityTypes} />;
  // }, [entityTypes]);

  const categoryName = ENTITY_TYPE_TO_CATEGORY[entityTypes[0]];

  return (
    <QuickNavigator
      homeComponent={homeComponent}
      calendarComponent={calendarComponent}
      referencesComponent={referencesComponent}
      // listsComponent={listsComponent}
      categoryName={categoryName || ''}
    />
  );
}
