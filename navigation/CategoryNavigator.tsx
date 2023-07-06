import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  createNativeStackNavigator,
  NativeStackHeaderProps
} from '@react-navigation/native-stack';
import Calendar from 'components/calendars/TaskCalendar';
import DropDown from 'components/molecules/DropDownView';
import { WhitePaddedView } from 'components/molecules/ViewComponents';
import CategoryHome from 'components/organisms/CategoryHome';
import ReferencesList from 'components/organisms/ReferencesList';
import { Text } from 'components/Themed';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useGetAllReferenceGroupsQuery } from 'reduxStore/services/api/references';
import { selectCategoryById } from 'reduxStore/slices/categories/selectors';
import { selectScheduledTaskIdsByCategories } from 'reduxStore/slices/tasks/selectors';
import { CategoryTabParamList } from 'types/base';
import { createDropDownNavigator } from './base/DropDownNavigator';

// const TopTabs = createMaterialTopTabNavigator<CategoryTabParamList>();
const TopTabs = createDropDownNavigator<CategoryTabParamList>();

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

  const { data: referenceGroups } = useGetAllReferenceGroupsQuery();

  const categoryTags = useMemo(() => {
    return referenceGroups && category
      ? Object.keys(referenceGroups.byTagName).filter(
          (tagName) => tagName.indexOf(category.name) === 0
        )
      : [];
  }, [referenceGroups, category]);

  const homeComponent = useMemo(() => {
    return () => <CategoryHome categoryId={categoryId} />;
  }, [categoryId]);

  const calendarComponent = useMemo(() => {
    return () => <Calendar showFilters={false} filteredTasks={filteredTasks} />;
  }, [filteredTasks]);

  const referencesComponent = useMemo(() => {
    return () => (
      <ReferencesList categories={[categoryId]} tags={categoryTags} />
    );
  }, [categoryId, categoryTags]);

  const listsComponent = useMemo(() => {
    return () => null;
  }, []);

  if (!referenceGroups) {
    return null;
  }

  return (
    <TopTabs.Navigator initialRouteName="CategoryHome">
      <TopTabs.Screen
        name="CategoryHome"
        component={homeComponent}
        options={{
          title: t('pageTitles.home')
        }}
      />
      <TopTabs.Screen
        name="CategoryCalendar"
        component={calendarComponent}
        options={{
          title: t('pageTitles.calendar')
        }}
      />
      <TopTabs.Screen
        name="CategoryReferences"
        component={referencesComponent}
        options={{
          title: t('pageTitles.references')
        }}
      />
      <TopTabs.Screen
        name="CategoryLists"
        component={listsComponent}
        options={{
          title: t('pageTitles.lists')
        }}
      />
    </TopTabs.Navigator>
  );
}
