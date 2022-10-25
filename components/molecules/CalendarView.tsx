import { useThemeColor, View } from 'components/Themed';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { PeriodResponse } from 'types/periods';
import {
  getDateWithoutTimezone,
  getUTCValuesFromDateString
} from 'utils/datesAndTimes';
import { WhiteFullPageScrollView } from './ScrollViewComponents';
import { AlmostBlackText } from './TextComponents';
import useScheduledPeriods from 'hooks/useScheduledPeriods';
import { useNavigation } from '@react-navigation/native';

const getPeriodsOnDay = (day: DateData, allPeriods: PeriodResponse[]) => {
  return allPeriods.filter((period) => {
    if (
      getDateWithoutTimezone(period.end_date) <
      getDateWithoutTimezone(day.dateString)
    )
      return false;
    if (
      getDateWithoutTimezone(period.start_date) >
      getDateWithoutTimezone(day.dateString)
    )
      return false;
    return true;
  });
};

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
};

export default function CalendarView({ dates }: CalendarViewProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const greyColor = useThemeColor({}, 'grey');
  const [selectedDay, setSelectedDay] = useState<DateData | null>(null);
  const styles = style();
  const allPeriods = useScheduledPeriods();
  const navigation = useNavigation();

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

  const selectedDayPeriods =
    allPeriods && selectedDay ? getPeriodsOnDay(selectedDay, allPeriods) : [];

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
        }}
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
