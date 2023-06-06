import React, { useMemo, useState } from 'react';
import { Text, useThemeColor } from 'components/Themed';
import { Pressable, SectionList, StyleSheet } from 'react-native';
import { AlmostBlackText, BlackText, PrimaryText } from './TextComponents';
import {
  TransparentView,
  WhiteContainerView,
  WhiteView
} from './ViewComponents';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useGetAllPeriodsQuery } from 'reduxStore/services/api/period';
import { FullPageSpinner, PaddedSpinner } from './Spinners';
import { getDateWithoutTimezone } from 'utils/datesAndTimes';
import { useTranslation } from 'react-i18next';
import SafePressable from './SafePressable';

export type TaskData = {
  title: string;
  message: string;
  key: number;
  date: string;
}[];

function useStyle() {
  return StyleSheet.create({
    sectionHeader: {
      backgroundColor: useThemeColor({}, 'almostWhite'),
      height: 45,
      justifyContent: 'center',
      paddingLeft: 18
    },
    divider: {
      height: 1,
      backgroundColor: useThemeColor({}, 'almostWhite')
    },
    sectionItem: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      flexDirection: 'row'
    },
    calendarContainer: {
      backgroundColor: useThemeColor({}, 'primary'),
      height: 27,
      width: 27,
      borderRadius: 27 / 2,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 13
    },
    showOlderWrapper: {
      padding: 10
    },
    showOlderText: {
      fontSize: 16
    }
  });
}

export type PeriodsProps = {
  periods: {
    title: string;
    key: string;
    data: TaskData;
  }[];
};
export default function Periods({ periods }: PeriodsProps) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { data: allPeriods } = useGetAllPeriodsQuery('');
  const [monthsBack, setMonthsBack] = useState(0);

  const earliestDate = useMemo(() => {
    const earliest = new Date();
    earliest.setDate(0);
    earliest.setMonth(earliest.getMonth() - monthsBack);
    return earliest;
  }, [monthsBack]);

  const filteredPeriods = useMemo(() => {
    for (const period of periods) {
      if (getDateWithoutTimezone(period.data[0].date) < earliestDate) {
        continue;
      }
      return periods.slice(periods.indexOf(period));
    }
    return [];
  }, [periods, earliestDate]);

  const styles = useStyle();

  if (!allPeriods) {
    return <PaddedSpinner style={{ height: '100%', paddingTop: 100 }} />;
  }

  return (
    <WhiteView style={{ height: '100%' }}>
      {monthsBack < 24 && (
        <SafePressable
          onPress={() => setMonthsBack(monthsBack + 6)}
          style={styles.showOlderWrapper}
        >
          <AlmostBlackText
            text={t('components.calendar.showOlderEvents')}
            style={styles.showOlderText}
          />
        </SafePressable>
      )}
      <SectionList
        sections={filteredPeriods}
        renderSectionHeader={({ section }) => (
          <TransparentView style={styles.sectionHeader}>
            <Text>{section.title}</Text>
          </TransparentView>
        )}
        renderItem={({ item }) => (
          <SafePressable
            style={styles.sectionItem}
            onPress={() => {
              (navigation.navigate as any)('ContentNavigator', {
                screen: 'EntityScreen',
                initial: false,
                params: { entityId: allPeriods.byId[item.key].entity }
              });
            }}
          >
            <TransparentView style={styles.calendarContainer}>
              <Feather name="calendar" color={'#fff'} size={15} />
            </TransparentView>

            <TransparentView>
              <PrimaryText text={item.title} />
              <BlackText text={item.message} />
            </TransparentView>
          </SafePressable>
        )}
        ItemSeparatorComponent={() => (
          <TransparentView style={styles.divider} />
        )}
        contentContainerStyle={{ paddingBottom: 400 }}
      />
    </WhiteView>
  );
}
