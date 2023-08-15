/*
  TaskCalendar - this is a calendar component for displaying tasks (and periods)
*/

import CalendarTaskDisplay from './components/CalendarTaskDisplay';
import React, { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
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
import { MinimalScheduledTask, ScheduledEntity } from './components/Task';
import {
  useGetAllScheduledTasksQuery,
  useGetAllTasksQuery
} from 'reduxStore/services/api/tasks';
import { ScheduledTaskType } from 'types/tasks';

dayjs.extend(utc);

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%'
  }
});

type CalendarProps = {
  showFilters?: boolean;
  filteredTasks: {
    [key: string]: (MinimalScheduledTask & {
      start_datetime?: string | undefined;
      end_datetime?: string | undefined;
      date?: string | undefined;
      duration?: number | undefined;
      type: ScheduledTaskType;
    })[];
  };
  filteredEntities?: { [key: string]: ScheduledEntity[] };
};
function Calendar({
  filteredTasks,
  filteredEntities,
  showFilters
}: CalendarProps) {
  // Force fetch the completion forms initially
  const { isLoading: isLoadingTaskCompletionForms } =
    useGetTaskCompletionFormsQuery(null as any);
  const { isLoading: isLoadingScheduledTasks } = useGetAllScheduledTasksQuery(
    null as any
  );
  const { isLoading: isLoadingTasks } = useGetAllTasksQuery(null as any);
  const dispatch = useDispatch();

  const [responsiveCalendar, setResponsiveCalendar] = useState(false);

  const MARGIN_BOTTOM = 0;
  const listView = useMemo(() => {
    if (!filteredTasks) {
      return () => null;
    }

    return () => (
      <TransparentView
        style={[styles.container, { marginBottom: MARGIN_BOTTOM }]}
      >
        <CalendarTaskDisplay
          tasks={filteredTasks}
          entities={filteredEntities}
          alwaysIncludeCurrentDate={true}
          onChangeFirstDate={(date) => {
            dispatch(setListEnforcedDate({ date }));
          }}
          showFilters={showFilters}
        />
      </TransparentView>
    );
  }, [
    JSON.stringify(filteredTasks),
    JSON.stringify(filteredEntities),
    dispatch,
    showFilters
  ]);

  const calendarView = useMemo(() => {
    return () => (
      <CalendarView
        tasks={filteredTasks}
        entities={filteredEntities}
        periods={[]}
        onChangeDate={(date) => {
          dispatch(setMonthEnforcedDate({ date }));
        }}
        hidden={!responsiveCalendar}
      />
    );
  }, [dispatch, filteredTasks, filteredEntities, responsiveCalendar]);

  const isLoading =
    isLoadingTaskCompletionForms || isLoadingScheduledTasks || isLoadingTasks;
  if (isLoading) {
    return <FullPageSpinner />;
  }

  const tabs = [
    {
      title: 'List',
      // component: () => null
      component: listView
    },
    {
      title: 'Month',
      // component: () => null
      component: calendarView
    }
  ];
  const calendarIndex = 1;

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
      />
      <Tabs
        tabs={tabs}
        onChangeIndex={(index) => {
          if (index === calendarIndex) {
            setResponsiveCalendar(true);
          } else {
            setResponsiveCalendar(false);
          }
        }}
      />
    </TransparentView>
  );
}

export default Calendar;
