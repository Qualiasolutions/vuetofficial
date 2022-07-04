import Calendar from 'components/calendars/Calendar';
import GenericError from 'components/molecules/GenericError';
import React from 'react';
import { Button, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { useGetAllScheduledTasksQuery } from 'reduxStore/services/api/tasks';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { WhiteView } from 'components/molecules/ViewComponents';

function CalendarScreen() {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);

  const currentMonthStart = new Date();
  currentMonthStart.setDate(1);
  const nextMonthStart = new Date();
  nextMonthStart.setMonth(nextMonthStart.getMonth() + 1);
  nextMonthStart.setDate(1);
  const [startDate, setStartDate] = React.useState<Date>(currentMonthStart);
  const [endDate, setEndDate] = React.useState<Date>(nextMonthStart);
  const {
    data: allTasks,
    error,
    isLoading
  } = useGetAllScheduledTasksQuery({
    start_datetime: `${startDate.getFullYear()}${(
      '0' +
      (startDate.getMonth() + 1)
    ).slice(-2)}01T00:00:00Z`,
    end_datetime: `${endDate.getFullYear()}${(
      '0' +
      (endDate.getMonth() + 1)
    ).slice(-2)}01T00:00:00Z`,
    user_id: userDetails?.user_id || -1
  });

  if (error) {
    return <GenericError />;
  }

  return isLoading || !allTasks ? null : (
    <WhiteView style={styles.container}>
      <Calendar tasks={allTasks} alwaysIncludeCurrentDate={true} />
      <Button
        title="LOAD MORE DATES"
        onPress={() => {
          const newEndDate = new Date(endDate);
          newEndDate.setMonth(newEndDate.getMonth() + 1);
          setEndDate(newEndDate);
        }}
      />
    </WhiteView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%'
  }
});

export default CalendarScreen;
