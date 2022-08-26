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
import {
  BlackText,
} from 'components/molecules/TextComponents';
import dayjs from 'dayjs';
import { FullPageSpinner } from 'components/molecules/Spinners';

function CalendarScreen() {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const currentMonth = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }`;
  const [shownMonth, setShownMonth] = React.useState<Date>(new Date());

  const {
    data: allTasks,
    error,
    isLoading,
    isFetching
  } = useGetAllScheduledTasksQuery({
    start_datetime: `${shownMonth.getFullYear()}${(
      '0' +
      (shownMonth.getMonth() + 1)
    ).slice(-2)}01T00:00:00Z`,
    end_datetime: `${shownMonth.getFullYear()}${(
      '0' +
      (shownMonth.getMonth() + 2)
    ).slice(-2)}01T00:00:00Z`,
    user_id: userDetails?.user_id || -1
  });

  // Preload previous month
  useGetAllScheduledTasksQuery({
    start_datetime: `${shownMonth.getFullYear()}${(
      '0' +
      (shownMonth.getMonth())
    ).slice(-2)}01T00:00:00Z`,
    end_datetime: `${shownMonth.getFullYear()}${(
      '0' +
      (shownMonth.getMonth() + 1)
    ).slice(-2)}01T00:00:00Z`,
    user_id: userDetails?.user_id || -1
  });

  // Preload next month
  useGetAllScheduledTasksQuery({
    start_datetime: `${shownMonth.getFullYear()}${(
      '0' +
      (shownMonth.getMonth() + 2)
    ).slice(-2)}01T00:00:00Z`,
    end_datetime: `${shownMonth.getFullYear()}${(
      '0' +
      (shownMonth.getMonth() + 3)
    ).slice(-2)}01T00:00:00Z`,
    user_id: userDetails?.user_id || -1
  });

  if (error) {
    return <GenericError />;
  }

  return isLoading || !allTasks ? <FullPageSpinner/> : (
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
      {
        isFetching ? <FullPageSpinner/> : <Calendar
          tasks={allTasks}
          alwaysIncludeCurrentDate={
            currentMonth ===
            `${shownMonth.getFullYear()}-${shownMonth.getMonth() + 1}`
          }
        />
      }
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
