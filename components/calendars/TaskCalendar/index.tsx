/*
  TaskCalendar - this is a calendar component for displaying tasks (and periods)
*/

import CalendarTaskDisplay from './components/CalendarTaskDisplay';
import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { useGetAllScheduledTasksQuery } from 'reduxStore/services/api/tasks';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { TransparentView } from 'components/molecules/ViewComponents';
import dayjs from 'dayjs';
import { FullPageSpinner } from 'components/molecules/Spinners';
import utc from 'dayjs/plugin/utc';
import CalendarView from 'components/molecules/CalendarViewV2';
import Tabs from 'components/molecules/Tabs';
import { getDateStringFromDateObject } from 'utils/datesAndTimes';
import {
  setListEnforcedDate,
  setMonthEnforcedDate
} from 'reduxStore/slices/calendars/actions';
import MonthSelector from './components/MonthSelector';
import { useGetTaskCompletionFormsQuery } from 'reduxStore/services/api/taskCompletionForms';
import { MinimalScheduledTask } from './components/Task';

dayjs.extend(utc);

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%'
  }
});

type CalendarProps = {
  fullPage: boolean;
  filteredTasks: {
    [key: string]: (MinimalScheduledTask & {
      start_datetime?: string | undefined;
      end_datetime?: string | undefined;
      date?: string | undefined;
      duration?: number | undefined;
    })[];
  };
};
function Calendar({ fullPage, filteredTasks }: CalendarProps) {
  // Force fetch the completion forms initially
  const { isLoading: isLoadingTaskCompletionForms } =
    useGetTaskCompletionFormsQuery();
  const dispatch = useDispatch();

  const MARGIN_BOTTOM = 150;
  const listView = useMemo(() => {
    if (!filteredTasks) {
      return () => null;
    }

    return () => (
      <TransparentView style={{ marginBottom: MARGIN_BOTTOM }}>
        <CalendarTaskDisplay
          tasks={filteredTasks}
          alwaysIncludeCurrentDate={true}
          onChangeFirstDate={(date) => {
            dispatch(setListEnforcedDate({ date }));
          }}
        />
      </TransparentView>
    );
  }, [JSON.stringify(filteredTasks), dispatch]);

  const calendarView = useMemo(() => {
    return () => (
      <CalendarView
        tasks={filteredTasks}
        periods={[]}
        onChangeDate={(date) => {
          dispatch(setMonthEnforcedDate({ date }));
        }}
      />
    );
  }, [dispatch, filteredTasks]);

  const isLoading = isLoadingTaskCompletionForms;
  if (isLoading) {
    return <FullPageSpinner />;
  }

  const tabs = [
    {
      title: 'List',
      component: listView
    },
    {
      title: 'Month',
      component: calendarView
    }
  ];

  return (
    <TransparentView style={styles.container}>
      <MonthSelector
        onValueChange={(date) => {
          if (date) {
            const dateString = getDateStringFromDateObject(date);
            dispatch(setMonthEnforcedDate({ date: dateString }));
            dispatch(setListEnforcedDate({ date: dateString }));
          }
        }}
        fullPage={fullPage}
      />
      <Tabs tabs={tabs} />
    </TransparentView>
  );
}

export default Calendar;
