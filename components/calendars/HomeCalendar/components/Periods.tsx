import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Text, useThemeColor } from 'components/Themed';
import { Pressable, SectionList, StyleSheet } from 'react-native';
import { AlmostBlackText, BlackText, PrimaryText } from 'components/molecules/TextComponents';
import {
  TransparentView,
  WhiteView
} from 'components/molecules/ViewComponents';
import { Feather } from '@expo/vector-icons';
import { PaddedSpinner } from 'components/molecules/Spinners';
import { getDateWithoutTimezone } from 'utils/datesAndTimes';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'components/molecules/TouchableOpacityComponents';

export type PeriodData = {
  title: string;
  message: string;
  key: string;
  date: string;
}[];

export type PeriodsProps = {
  periods: {
    title: string;
    key: string;
    data: PeriodData;
  }[];
  onChangeFirstDate?: (date: string) => void;
  defaultDate?: string | null;
};
export default function Periods({ periods, onChangeFirstDate, defaultDate }: PeriodsProps) {
  const { t } = useTranslation();
  const [monthsBack, setMonthsBack] = useState(0);
  const listRef = useRef<SectionList | null>(null)

  const earliestDate = useMemo(() => {
    const earliest = defaultDate ? new Date(defaultDate) : new Date();
    if (!defaultDate) {
      earliest.setDate(0);
    }
    earliest.setMonth(earliest.getMonth() - monthsBack);
    return earliest;
  }, [monthsBack, defaultDate]);

  const filteredPeriods = useMemo(() => {
    for (const period of periods) {
      if (getDateWithoutTimezone(period.data[0].date) < earliestDate) {
        continue;
      }
      return periods.slice(periods.indexOf(period));
    }
    return [];
  }, [periods, earliestDate]);

  const styles = style();

  return (
    <WhiteView style={{ height: '100%' }}>
      {monthsBack < 24 && (
        <TouchableOpacity
          onPress={() => setMonthsBack(monthsBack + 6)}
          style={styles.showOlderWrapper}
        >
          <AlmostBlackText
            text={t('components.calendar.showOlderEvents')}
            style={styles.showOlderText}
          />
        </TouchableOpacity>
      )}
      <SectionList
        ref={listRef}
        sections={filteredPeriods}
        renderSectionHeader={({ section }) => (
          <TransparentView style={styles.sectionHeader}>
            <Text>{section.title}</Text>
          </TransparentView>
        )}
        renderItem={({ item }) => (
          <Pressable
            style={styles.sectionItem}
            onPress={() => { }}
          >
            <TransparentView style={styles.calendarContainer}>
              <Feather name="calendar" color={'#fff'} size={15} />
            </TransparentView>

            <TransparentView style={{ flexDirection: "row" }}>
              {item.message && <BlackText text={item.message} style={{ marginRight: 10 }} />}
              <PrimaryText text={item.title} />
            </TransparentView>
          </Pressable>
        )}
        ItemSeparatorComponent={() => (
          <TransparentView style={styles.divider} />
        )}
        contentContainerStyle={{ paddingBottom: 400 }}
        onViewableItemsChanged={(items) => {
          if (onChangeFirstDate) {
            onChangeFirstDate(items.viewableItems[0]?.section?.date)
          }
        }}
      />
    </WhiteView>
  );
}

function style() {
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
