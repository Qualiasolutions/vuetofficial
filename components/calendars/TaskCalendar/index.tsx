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
import useScheduledPeriods from 'hooks/useScheduledPeriods';
import { ParsedPeriod, PeriodResponse } from 'types/periods';
import CalendarView from 'components/molecules/CalendarViewV2';
import Tabs from 'components/molecules/Tabs';
import {
  getDateStringFromDateObject,
  getDateWithoutTimezone
} from 'utils/datesAndTimes';
import {
  setListEnforcedDate,
  setMonthEnforcedDate
} from 'reduxStore/slices/calendars/actions';
import MonthSelector from './components/MonthSelector';
import { useGetTaskCompletionFormsQuery } from 'reduxStore/services/api/taskCompletionForms';
import { selectFilteredScheduledTaskIdsByDate } from 'reduxStore/slices/calendars/selectors';

dayjs.extend(utc);

const parsePeriodResponse = (res: PeriodResponse): ParsedPeriod => {
  const parsedPeriod = {
    ...res,
    end_date: getDateWithoutTimezone(res.end_date),
    start_date: getDateWithoutTimezone(res.start_date)
  };
  delete parsedPeriod.reminders;

  return parsedPeriod;
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%'
  }
});

type CalendarProps = {
  periodFilters: ((period: ParsedPeriod) => boolean)[];
  fullPage: boolean;
};
function Calendar({ periodFilters, fullPage }: CalendarProps) {
  // Force fetch the completion forms initially
  const { isLoading: isLoadingTaskCompletionForms } =
    useGetTaskCompletionFormsQuery();
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  // Force fetch the scheduled tasks initially
  const { isLoading: isLoadingScheduledTasks } = useGetAllScheduledTasksQuery(
    null as any,
    {
      skip: !userDetails?.user_id
    }
  );
  const dispatch = useDispatch();

  const { periods: allScheduledPeriods, isLoading: isLoadingPeriods } =
    useScheduledPeriods();

  const parsedPeriods = useMemo(() => {
    if (!allScheduledPeriods) {
      return [];
    }
    return allScheduledPeriods.map(parsePeriodResponse);
  }, [allScheduledPeriods]);

  const filteredTasks = useSelector(selectFilteredScheduledTaskIdsByDate);

  const filteredAllPeriods = useMemo<ParsedPeriod[]>(() => {
    if (!parsedPeriods) {
      return [];
    } else {
      let filtered = parsedPeriods;
      for (const periodFilter of periodFilters) {
        filtered = filtered.filter(periodFilter);
      }
      return filtered;
    }
  }, [parsedPeriods, periodFilters]);

  const MARGIN_BOTTOM = 150;
  const listView = useMemo(() => {
    if (!filteredTasks || !filteredAllPeriods) {
      return () => null;
    }

    return () => (
      <TransparentView style={{ marginBottom: MARGIN_BOTTOM }}>
        <CalendarTaskDisplay
          tasks={filteredTasks}
          periods={filteredAllPeriods}
          alwaysIncludeCurrentDate={true}
          onChangeFirstDate={(date) => {
            dispatch(setListEnforcedDate({ date }));
          }}
        />
      </TransparentView>
    );
  }, [JSON.stringify(filteredTasks), filteredAllPeriods, dispatch]);

  const calendarView = useMemo(() => {
    if (!allScheduledPeriods) {
      return () => null;
    }

    return () => (
      <CalendarView
        tasks={filteredTasks}
        periods={filteredAllPeriods}
        onChangeDate={(date) => {
          dispatch(setMonthEnforcedDate({ date }));
        }}
      />
    );
  }, [allScheduledPeriods, dispatch, filteredTasks, filteredAllPeriods]);

  const isLoading =
    isLoadingScheduledTasks || isLoadingPeriods || isLoadingTaskCompletionForms;
  if (isLoading || !allScheduledPeriods) {
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
