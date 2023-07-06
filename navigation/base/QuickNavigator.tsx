import { Text } from 'components/Themed';
import iWantToOptions from 'constants/iWantToOptions';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetAllReferenceGroupsQuery } from 'reduxStore/services/api/references';
import { QuickNavTabParamList } from 'types/base';
import { CategoryName } from 'types/categories';
import { createDropDownNavigator } from './DropDownNavigator';

const TopTabs = createDropDownNavigator<QuickNavTabParamList>();
const QUICK_NAV_ID = 'QUICK_NAV';
const I_WANT_TO_ID = 'I_WANT_TO';

export default function QuickNavigator({
  homeComponent,
  calendarComponent,
  referencesComponent,
  listsComponent,
  messagesComponent,
  categoryName
}: {
  homeComponent?: (() => JSX.Element | null) | null;
  calendarComponent?: (() => JSX.Element | null) | null;
  referencesComponent?: (() => JSX.Element | null) | null;
  listsComponent?: (() => JSX.Element | null) | null;
  messagesComponent?: (() => JSX.Element | null) | null;
  categoryName: CategoryName | '';
}) {
  const { t } = useTranslation();
  const { data: referenceGroups } = useGetAllReferenceGroupsQuery();

  const iWantToComponents = useMemo(() => {
    if (!categoryName) {
      return {};
    }
    const comps: { [key: string]: () => JSX.Element } = {};
    for (const opt of iWantToOptions[categoryName]) {
      comps[opt] = () => <Text>{opt}</Text>;
    }
    return comps;
  }, [categoryName]);

  if (!referenceGroups) {
    return null;
  }

  return (
    <TopTabs.Navigator initialRouteName="CategoryHome">
      {homeComponent && (
        <TopTabs.Screen
          name="CategoryHome"
          component={homeComponent}
          options={{
            title: t('pageTitles.home'),
            dropDownId: QUICK_NAV_ID
          }}
        />
      )}
      {calendarComponent && (
        <TopTabs.Screen
          name="CategoryCalendar"
          component={calendarComponent}
          options={{
            title: t('pageTitles.calendar'),
            dropDownId: QUICK_NAV_ID
          }}
        />
      )}
      {referencesComponent && (
        <TopTabs.Screen
          name="CategoryReferences"
          component={referencesComponent}
          options={{
            title: t('pageTitles.references'),
            dropDownId: QUICK_NAV_ID
          }}
        />
      )}
      {listsComponent && (
        <TopTabs.Screen
          name="CategoryLists"
          component={listsComponent}
          options={{
            title: t('pageTitles.lists'),
            dropDownId: QUICK_NAV_ID
          }}
        />
      )}
      {messagesComponent && (
        <TopTabs.Screen
          name="CategoryMessages"
          component={messagesComponent}
          options={{
            title: t('pageTitles.messages'),
            dropDownId: QUICK_NAV_ID
          }}
        />
      )}
      {Object.entries(iWantToComponents).map(([opt, comp], i) => (
        <TopTabs.Screen
          key={i}
          name={`IWantTo_${i}`}
          component={comp}
          options={{
            title: opt,
            dropDownId: I_WANT_TO_ID
          }}
        />
      ))}
    </TopTabs.Navigator>
  );
}
