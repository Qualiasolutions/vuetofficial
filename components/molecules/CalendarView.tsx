import { useThemeColor, View } from 'components/Themed';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import {
  getDateWithoutTimezone,
  getUTCValuesFromDateString
} from 'utils/datesAndTimes';
import { WhiteFullPageScrollView } from './ScrollViewComponents';
import { AlmostBlackText } from './TextComponents';
import useScheduledPeriods from 'hooks/useScheduledPeriods';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectListEnforcedDate } from 'reduxStore/slices/calendars/selectors';

export type CalendarViewProps = {
  dates: {
    [key: string]: {
      periods: {
        startingDay?: boolean;
        endingDay?: boolean;
        color: string;
        id?: number;
      }[];
      selected?: boolean;
      selectedColor?: string;
    };
  };
  onChangeDate?: (date: string) => void;
};

export default function CalendarView({ dates, onChangeDate }: CalendarViewProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const greyColor = useThemeColor({}, 'grey');
  const [selectedDay, setSelectedDay] = useState<DateData | null>(null);
  const styles = style();
  const { periods: allPeriods, reminders: allReminders } =
    useScheduledPeriods();
  const navigation = useNavigation();
  const listEnforcedDate = useSelector(selectListEnforcedDate)

  const updateDate = (newDate: string) => {
    if (onChangeDate) {
      // Put this in a timeout so that we don't have
      // to wait for updates
      setTimeout(() => {
        onChangeDate(newDate)
      }, 1)
    }
  }

  const datesCopy = { ...dates };
  if (selectedDay) {
    if (!datesCopy[selectedDay.dateString]) {
      datesCopy[selectedDay.dateString] = { periods: [] };
    } else {
      datesCopy[selectedDay.dateString] = {
        ...datesCopy[selectedDay.dateString]
      };
    }
    datesCopy[selectedDay.dateString].selected = true;
    datesCopy[selectedDay.dateString].selectedColor = greyColor;
  }

  const selectedDayPeriods = useMemo(() => {
    if (allPeriods && selectedDay) {
      if (selectedDay.dateString in dates) {
        return allPeriods.filter((period) => {
          if (
            getDateWithoutTimezone(period.end_date) <
            getDateWithoutTimezone(selectedDay.dateString)
          ) {
            return false;
          }
          if (
            getDateWithoutTimezone(period.start_date) >
            getDateWithoutTimezone(selectedDay.dateString)
          ) {
            return false;
          }
          return dates[selectedDay.dateString].periods
            .map((p) => p.id)
            .includes(period.id);
        });
      }
    }
    return [];
  }, [selectedDay, dates, allPeriods]);

  return (
    <WhiteFullPageScrollView style={styles.container}>
      <Calendar
        minDate={'2012-05-10'}
        theme={{
          monthTextColor: primaryColor,
          textMonthFontSize: 16,
          selectedDayTextColor: primaryColor,
          textDayFontFamily: 'Poppins',
          textMonthFontFamily: 'Poppins',
          textDayHeaderFontFamily: 'Poppins'
        }}
        markingType="multi-period"
        markedDates={datesCopy}
        calendarStyle={{ height: '100%' }}
        pagingEnabled={true}
        horizontal={true}
        onDayPress={(day) => {
          setSelectedDay(day);
          updateDate(day.dateString)
        }}
        onPressArrowLeft={(cb, date) => {
          cb()
          if (date) {
            updateDate(date.addMonths(-1).toString('yyyy-MM-dd'))
          }
        }}
        onPressArrowRight={(cb, date) => {
          cb()
          if (date) {
            updateDate(date.addMonths(1).toString('yyyy-MM-dd'))
          }
        }}
        initialDate={listEnforcedDate || undefined}
      />

      {allPeriods && selectedDayPeriods && (
        <View style={styles.periodList}>
          {selectedDayPeriods.map((period) => {
            const periodStartUtcValues = getUTCValuesFromDateString(
              period.start_date
            );
            const periodEndUtcValues = getUTCValuesFromDateString(
              period.end_date
            );

            const text =
              periodStartUtcValues.day === periodEndUtcValues.day &&
                periodStartUtcValues.monthShortName ===
                periodEndUtcValues.monthShortName
                ? `${periodStartUtcValues.day} ${periodStartUtcValues.monthShortName}`
                : `${periodStartUtcValues.day} ${periodStartUtcValues.monthShortName} - ${periodEndUtcValues.day} ${periodEndUtcValues.monthShortName}`;
            return (
              <Pressable
                style={styles.periodListElement}
                key={period.id}
                onPress={() => {
                  (navigation.navigate as any)('EntityNavigator', {
                    screen: 'EntityScreen',
                    initial: false,
                    params: { entityId: period.entity }
                  });
                }}
              >
                <AlmostBlackText
                  text={period.title}
                  style={styles.periodListTitleText}
                />
                <AlmostBlackText text={text} />
              </Pressable>
            );
          })}
        </View>
      )}
    </WhiteFullPageScrollView>
  );
}

function style() {
  return StyleSheet.create({
    container: { marginBottom: 0 },
    periodList: { paddingBottom: 250 },
    periodListElement: { margin: 10 },
    periodListTitleText: { fontSize: 18 }
  });
}
