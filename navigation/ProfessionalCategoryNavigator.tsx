import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Calendar from 'components/calendars/TaskCalendar';
import EntityListPage from 'components/lists/EntityListPage';
import ProfessionalEntityListPage from 'components/lists/ProfessionalEntityListPage';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import ReferencesList from 'components/organisms/ReferencesList';
import ENTITY_TYPE_TO_CATEGORY from 'constants/EntityTypeToCategory';
import useCategoryHeader from 'headers/hooks/useCategoryHeader';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectProfessionalCategoryById } from 'reduxStore/slices/categories/selectors';
import {
  selectFilteredScheduledEntityIds,
  selectScheduledTaskIdsByEntityTypes
} from 'reduxStore/slices/tasks/selectors';
import { ContentTabParamList } from 'types/base';
import { EntityTypeName } from 'types/entities';
import QuickNavigator from './base/QuickNavigator';

export default function ProfessionalCategoryNavigator({
  route
}: NativeStackScreenProps<ContentTabParamList, 'ProfessionalCategory'>) {
  const categoryId = route.params.categoryId;
  const { t } = useTranslation();
  const category = useSelector(selectProfessionalCategoryById(categoryId));

  useCategoryHeader(category?.name || '', true);
  // const taskSelector = useMemo(
  //   () => selectScheduledTaskIdsByEntityTypes(entityTypes),
  //   [entityTypes]
  // );
  // const filteredTasks = useSelector(taskSelector);

  // const filteredEntities = useSelector(
  //   selectFilteredScheduledEntityIds(entityTypes)
  // );

  const homeComponent = useMemo(() => {
    return () => (
      <TransparentFullPageScrollView>
        <ProfessionalEntityListPage professionalCategory={categoryId} />
      </TransparentFullPageScrollView>
    );
  }, [categoryId]);

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
  //   return () => <ReferencesList entityTypes={entityTypes} />;
  // }, [entityTypes]);

  const quickNavPages = [];
  if (homeComponent) {
    quickNavPages.push({
      name: 'Home',
      title: t('pageTitles.home'),
      component: homeComponent
    });
  }
  // if (calendarComponent) {
  //   quickNavPages.push({
  //     name: 'Calendar',
  //     title: t('pageTitles.calendar'),
  //     component: calendarComponent
  //   });
  // }
  // quickNavPages.push({
  //   name: 'References',
  //   title: t('pageTitles.references'),
  //   component: referencesComponent
  // });

  return <QuickNavigator categoryName={''} quickNavPages={quickNavPages} />;
}
