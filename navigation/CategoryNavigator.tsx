import Calendar from 'components/calendars/TaskCalendar';
import CategoryHome from 'components/organisms/CategoryHome';
import ReferencesList from 'components/organisms/ReferencesList';
import ENTITY_TYPE_TO_CATEGORY from 'constants/EntityTypeToCategory';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectCategoryById } from 'reduxStore/slices/categories/selectors';
import {
  selectFilteredScheduledEntityIds,
  selectScheduledTaskIdsByCategories
} from 'reduxStore/slices/tasks/selectors';
import { EntityTypeName } from 'types/entities';
import QuickNavigator from './base/QuickNavigator';

export default function CategoryNavigator({
  categoryId
}: {
  categoryId: number;
}) {
  const { t } = useTranslation();
  const taskSelector = useMemo(
    () => selectScheduledTaskIdsByCategories([categoryId]),
    [categoryId]
  );
  const filteredTasks = useSelector(taskSelector);
  const category = useSelector(selectCategoryById(categoryId));

  const categoryEntityTypes = category
    ? (Object.keys(ENTITY_TYPE_TO_CATEGORY).filter(
        (entityTypeName) =>
          ENTITY_TYPE_TO_CATEGORY[entityTypeName as EntityTypeName] ===
          category.name
      ) as EntityTypeName[])
    : [];

  const filteredEntities = useSelector(
    selectFilteredScheduledEntityIds(categoryEntityTypes)
  );

  const homeComponent = useMemo(() => {
    return () => <CategoryHome categoryId={categoryId} />;
  }, [categoryId]);

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
    return () => <ReferencesList categories={[categoryId]} />;
  }, [categoryId]);

  const quickNavPages = [];
  if (homeComponent) {
    quickNavPages.push({
      name: 'Home',
      title: t('pageTitles.home'),
      component: homeComponent
    });
  }
  if (calendarComponent) {
    quickNavPages.push({
      name: 'Calendar',
      title: t('pageTitles.calendar'),
      component: calendarComponent
    });
  }
  quickNavPages.push({
    name: 'References',
    title: t('pageTitles.references'),
    component: referencesComponent
  });

  return (
    <QuickNavigator
      categoryName={category?.name || ''}
      quickNavPages={quickNavPages}
    />
  );
}
