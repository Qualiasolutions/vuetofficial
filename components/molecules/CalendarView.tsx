import { useThemeColor } from 'components/Themed';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { WhiteFullPageScrollView } from './ScrollViewComponents';
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

function useStyle() {
  return StyleSheet.create({
    container: { marginBottom: 0 },
    periodList: { paddingBottom: 250 },
    periodListElement: { margin: 10 },
    periodListTitleText: { fontSize: 18 }
  });
}

export default function CalendarView({
  dates,
  onChangeDate
}: CalendarViewProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const greyColor = useThemeColor({}, 'grey');
  const [selectedDay, setSelectedDay] = useState<DateData | null>(null);
  const styles = useStyle();
  const listEnforcedDate = useSelector(selectListEnforcedDate);

  const updateDate = (newDate: string) => {
    if (onChangeDate) {
      // Put this in a timeout so that we don't have
      // to wait for updates
      setTimeout(() => {
        onChangeDate(newDate);
      }, 1);
    }
  };

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
          updateDate(day.dateString);
        }}
        onPressArrowLeft={(cb, date) => {
          cb();
          if (date) {
            updateDate(date.addMonths(-1).toString('yyyy-MM-dd'));
          }
        }}
        onPressArrowRight={(cb, date) => {
          cb();
          if (date) {
            updateDate(date.addMonths(1).toString('yyyy-MM-dd'));
          }
        }}
        initialDate={listEnforcedDate || undefined}
      />
    </WhiteFullPageScrollView>
  );
}
