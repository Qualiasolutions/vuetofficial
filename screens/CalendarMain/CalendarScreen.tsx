import Calendar from 'components/calendars/Calendar';
import GenericError from 'components/molecules/GenericError';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { useGetAllScheduledTasksQuery } from 'reduxStore/services/api/tasks';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import {
  TransparentView,
  WhiteView
} from 'components/molecules/ViewComponents';
import { BlackText } from 'components/molecules/TextComponents';
import dayjs from 'dayjs';
import { FullPageSpinner } from 'components/molecules/Spinners';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const getOffsetMonthStartDateString = (
  date: Date,
  offset: number
): {
  date: Date;
  dateString: string;
} => {
  const dateCopy = new Date(date.getTime());
  dateCopy.setHours(0);
  dateCopy.setMinutes(0);
  dateCopy.setSeconds(0);
  dateCopy.setMilliseconds(0);
  dateCopy.setDate(1);
  dateCopy.setMonth(dateCopy.getMonth() + offset);
  return {
    date: dateCopy,
    dateString: dayjs.utc(dateCopy).format('YYYY-MM-DDTHH:mm:ss') + 'Z'
  };
};

function CalendarScreen() {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const currentMonth = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }`;

  const currentDate = new Date();
  const [shownMonth, setShownMonth] = React.useState<Date>(
    getOffsetMonthStartDateString(currentDate, 0).date
  );

  const {
    data: allTasks,
    error,
    isLoading,
    isFetching
  } = useGetAllScheduledTasksQuery({
    start_datetime: getOffsetMonthStartDateString(shownMonth, 0).dateString,
    end_datetime: getOffsetMonthStartDateString(shownMonth, 1).dateString,
    user_id: userDetails?.user_id || -1
  });

  // Preload previous month
  useGetAllScheduledTasksQuery({
    start_datetime: getOffsetMonthStartDateString(shownMonth, -1).dateString,
    end_datetime: getOffsetMonthStartDateString(shownMonth, 0).dateString,
    user_id: userDetails?.user_id || -1
  });

  // Preload next month
  useGetAllScheduledTasksQuery({
    start_datetime: getOffsetMonthStartDateString(shownMonth, 1).dateString,
    end_datetime: getOffsetMonthStartDateString(shownMonth, 2).dateString,
    user_id: userDetails?.user_id || -1
  });

  if (error) {
    return <GenericError />;
  }

  return isLoading || !allTasks ? (
    <FullPageSpinner />
  ) : (
    <WhiteView style={styles.container}>
      <TransparentView style={styles.monthPicker}>
        <Pressable
          style={styles.monthPickerArrowWrapper}
          onPress={() => {
            const prevMonth = new Date(shownMonth.getTime());
            prevMonth.setMonth(prevMonth.getMonth() - 1);
            setShownMonth(prevMonth);
          }}
        >
          <BlackText text="<" style={styles.monthPickerArrow} />
        </Pressable>
        <BlackText
          text={dayjs(shownMonth).format('MMM')}
          style={styles.monthPickerText}
        />
        <Pressable
          style={styles.monthPickerArrowWrapper}
          onPress={() => {
            const nextMonth = new Date(shownMonth.getTime());
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            setShownMonth(nextMonth);
          }}
        >
          <BlackText text=">" style={styles.monthPickerArrow} />
        </Pressable>
      </TransparentView>
      {isFetching ? (
        <FullPageSpinner />
      ) : (
        <Calendar
          tasks={allTasks}
          alwaysIncludeCurrentDate={
            currentMonth ===
            `${shownMonth.getFullYear()}-${shownMonth.getMonth() + 1}`
          }
        />
      )}
    </WhiteView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%'
  },
  monthPicker: {
    flexDirection: 'row',
    paddingHorizontal: 40,
    alignItems: 'center'
  },
  monthPickerText: {
    fontSize: 22
  },
  monthPickerArrowWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  monthPickerArrow: {
    fontSize: 40,
    fontWeight: 'bold',
    marginHorizontal: 10
  }
});

export default CalendarScreen;
