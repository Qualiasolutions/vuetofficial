import { Text, useThemeColor, View } from 'components/Themed';
import getUserFullDetails from 'hooks/useGetUserDetails';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { CalendarList, Calendar, DateData } from 'react-native-calendars';
import { useGetScheduledPeriodsQuery } from 'reduxStore/services/api/period';
import { Period } from 'reduxStore/services/api/types';
import { getUTCValuesFromDateString } from 'utils/datesAndTimes';
import ColourBar from './ColourBar';
import { WhiteFullPageScrollView } from './ScrollViewComponents';
import { AlmostBlackText } from './TextComponents';

export type CalendarViewProps = {
  dates: {
    [key: string]: {
      periods: {
        startingDay?: boolean,
        endingDay?: boolean,
        color: string,
        id?: number
      }[],
      selected?: boolean,
      selectedColor?: string
    };
  };
};

export default function CalendarView({ dates }: CalendarViewProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const greyColor = useThemeColor({}, 'grey');
  const [ selectedDay, setSelectedDay ] = useState<DateData | null>(null)
  const styles = style();

  const { data: userDetails } = getUserFullDetails();
  const { data: allPeriods } = useGetScheduledPeriodsQuery(
    userDetails?.id || -1,
    { skip: !userDetails?.id }
  );

  const datesCopy = { ...dates }
  if (selectedDay) {
    if (!datesCopy[selectedDay.dateString]) {
      datesCopy[selectedDay.dateString] = { periods: [] }
    } else {
      datesCopy[selectedDay.dateString] = { ...datesCopy[selectedDay.dateString] }
    }
    datesCopy[selectedDay.dateString].selected = true
    datesCopy[selectedDay.dateString].selectedColor = greyColor
  }

  const selectedDayPeriods = selectedDay ? datesCopy[selectedDay.dateString].periods : []

  return (
    <WhiteFullPageScrollView>
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
          setSelectedDay(day)
        }}
      />
      {
        allPeriods && selectedDayPeriods?.map(period => {
          if (!period.id) return null
          const periodObj = allPeriods.byId[period.id]
          const periodStartUtcValues = getUTCValuesFromDateString(periodObj.start_date)
          const periodEndUtcValues = getUTCValuesFromDateString(periodObj.end_date)
          return (
            <View style={styles.periodListElement} key={periodObj.id}>
              <AlmostBlackText
                text={periodObj.title}
                style={styles.periodListTitleText}
              />
              <AlmostBlackText
                text={`${periodStartUtcValues.day} ${periodStartUtcValues.monthShortName} - ${periodEndUtcValues.day} ${periodEndUtcValues.monthShortName}`}
              />
            </View>
          )
        })
      }
    </WhiteFullPageScrollView>
  );
}

function style() {
  return StyleSheet.create({
    dayComponent: {
      width: 58,
      height: 70,
      borderWidth: 0.2,
      borderColor: useThemeColor({}, 'almostBlack'),
      padding: 5
    },
    date: { fontSize: 12, textAlign: 'left' },
    periodListElement: {margin: 10},
    periodListTitleText: { fontSize: 18 }
  });
}
