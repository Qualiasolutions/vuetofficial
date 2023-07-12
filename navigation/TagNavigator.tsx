import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Calendar from 'components/calendars/TaskCalendar';
import { FullPageSpinner } from 'components/molecules/Spinners';
import ReferencesList from 'components/organisms/ReferencesList';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useGetAllCategoriesQuery } from 'reduxStore/services/api/api';
import { selectScheduledTaskIdsByTagNames } from 'reduxStore/slices/tasks/selectors';
import { TagScreenTabParamList } from 'types/base';
import { CategoryName } from 'types/categories';

const TopTabs = createMaterialTopTabNavigator<TagScreenTabParamList>();

export default function TagNavigator({ tagName }: { tagName: string }) {
  const { t } = useTranslation();
  const taskSelector = useMemo(
    () => selectScheduledTaskIdsByTagNames([tagName]),
    [tagName]
  );
  const filteredTasks = useSelector(taskSelector);
  const { data: allCategories } = useGetAllCategoriesQuery(null as any);

  const calendarComponent = useMemo(() => {
    return () => <Calendar showFilters={false} filteredTasks={filteredTasks} />;
  }, [filteredTasks]);

  const referencesComponent = useMemo(() => {
    const infoCategoryTags: { [key: string]: CategoryName } = {
      TRAVEL__INFORMATION__PUBLIC: 'TRAVEL',
      TRANSPORT__INFORMATION__PUBLIC: 'TRANSPORT',
      CAREER__INFORMATION__PUBLIC: 'CAREER',
      SOCIAL__INFORMATION__PUBLIC: 'SOCIAL_INTERESTS'
    };

    if (Object.keys(infoCategoryTags).includes(tagName)) {
      const category = allCategories?.byName[infoCategoryTags[tagName]];

      if (!category) {
        return () => null;
      }

      return () => (
        <ReferencesList
          tagsFirst={true}
          categories={[category.id]}
          tags={[tagName]}
        />
      );
    }
    return () => <ReferencesList tags={[tagName]} />;
  }, [tagName, allCategories]);

  if (!allCategories) {
    return <FullPageSpinner />;
  }

  return (
    <TopTabs.Navigator initialRouteName="TagReferences">
      <TopTabs.Screen
        name="TagReferences"
        component={referencesComponent}
        options={{
          title: t('pageTitles.references')
        }}
      />
      <TopTabs.Screen
        name="TagCalendar"
        component={calendarComponent}
        options={{
          title: t('pageTitles.calendar')
        }}
      />
    </TopTabs.Navigator>
  );
}
