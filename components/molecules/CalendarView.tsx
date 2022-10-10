import { useThemeColor, View } from 'components/Themed';
import getUserFullDetails from 'hooks/useGetUserDetails';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useGetScheduledPeriodsQuery } from 'reduxStore/services/api/period';
import { Period } from 'reduxStore/services/api/types';
import { getDateWithoutTimezone, getUTCValuesFromDateString } from 'utils/datesAndTimes';
import { WhiteFullPageScrollView } from './ScrollViewComponents';
import { AlmostBlackText } from './TextComponents';

const getPeriodsOnDay = (day: DateData, allPeriods: Period[]) => {
  return allPeriods.filter(period => {
    if (getDateWithoutTimezone(period.end_date) < getDateWithoutTimezone(day.dateString)) return false
    if (getDateWithoutTimezone(period.start_date) > getDateWithoutTimezone(day.dateString)) return false
    return true
  })
}

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

  const [earliestPeriod, setEarliestPeriod] = useState<Date | null>(null)
  const [latestPeriod, setLatestPeriod] = useState<Date | null>(null)

  useEffect(() => {
    const twoYearsAgo = new Date()
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)
    const twoYearsAhead = new Date()
    twoYearsAhead.setFullYear(twoYearsAhead.getFullYear() + 2)
    setEarliestPeriod(twoYearsAgo)
    setLatestPeriod(twoYearsAhead)
  }, [])

  const { data: allPeriods } = useGetScheduledPeriodsQuery(
    {
      user_id: userDetails?.id || -1,
      start_datetime: earliestPeriod?.toISOString() as string,
      end_datetime: latestPeriod?.toISOString() as string,
    },
    { skip: !(userDetails?.id && earliestPeriod && latestPeriod) }
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

  const selectedDayPeriods = (allPeriods && selectedDay) ? getPeriodsOnDay(selectedDay, allPeriods) : []

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
          setSelectedDay(day)
        }}
      />

        {
          allPeriods && selectedDayPeriods && (
            <View style={styles.periodList}>
              {
                selectedDayPeriods.map(period => {
                  const periodStartUtcValues = getUTCValuesFromDateString(period.start_date)
                  const periodEndUtcValues = getUTCValuesFromDateString(period.end_date)
                  return (
                    <View style={styles.periodListElement} key={period.id}>
                      <AlmostBlackText
                        text={period.title}
                        style={styles.periodListTitleText}
                      />
                      <AlmostBlackText
                        text={`${periodStartUtcValues.day} ${periodStartUtcValues.monthShortName} - ${periodEndUtcValues.day} ${periodEndUtcValues.monthShortName}`}
                      />
                    </View>
                  )
                })
              }
          </View>
        )
        }
    </WhiteFullPageScrollView>
  );
}

function style() {
  return StyleSheet.create({
    container: { marginBottom: 0 },
    periodList: { paddingBottom: 200 },
    periodListElement: {margin: 10},
    periodListTitleText: { fontSize: 18 }
  });
}
