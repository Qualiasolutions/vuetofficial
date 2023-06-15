import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Calendar from 'components/calendars/TaskCalendar';
import EntityListPage from 'components/lists/EntityListPage';
import ReferencesList from 'components/organisms/ReferencesList';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectScheduledTaskIdsByEntityTypes } from 'reduxStore/slices/calendars/selectors';
import { EntityTypeTabParamList } from 'types/base';
import { EntityTypeName } from 'types/entities';

const TopTabs = createMaterialTopTabNavigator<EntityTypeTabParamList>();

export default function EntityTypeNavigator({
  entityTypes,
  entityTypeName
}: {
  entityTypes: EntityTypeName[];
  entityTypeName: string;
}) {
  const { t } = useTranslation();
  const taskSelector = useMemo(
    () => selectScheduledTaskIdsByEntityTypes(entityTypes),
    [entityTypes]
  );
  const filteredTasks = useSelector(taskSelector);

  const homeComponent = useMemo(() => {
    return () => (
      <EntityListPage
        entityTypes={entityTypes}
        entityTypeName={entityTypeName}
      />
    );
  }, [entityTypes, entityTypeName]);

  const calendarComponent = useMemo(() => {
    return () => (
      <Calendar
        fullPage={false}
        showFilters={false}
        filteredTasks={filteredTasks}
      />
    );
  }, [filteredTasks]);

  const referencesComponent = useMemo(() => {
    return () => <ReferencesList />;
    // return () => <ReferencesList entities={[entityTypes]} />;
  }, [entityTypes]);

  return (
    <TopTabs.Navigator initialRouteName="EntityTypeHome">
      <TopTabs.Screen
        name="EntityTypeHome"
        component={homeComponent}
        options={{
          title: t('pageTitles.home')
        }}
        initialParams={{
          entityTypes
        }}
      />
      <TopTabs.Screen
        name="EntityTypeCalendar"
        component={calendarComponent}
        options={{
          title: t('pageTitles.calendar')
        }}
        initialParams={{
          entityTypes
        }}
      />
      <TopTabs.Screen
        name="EntityTypeReferences"
        component={referencesComponent}
        options={{
          title: t('pageTitles.references')
        }}
        initialParams={{
          entityTypes
        }}
      />
    </TopTabs.Navigator>
  );
}
