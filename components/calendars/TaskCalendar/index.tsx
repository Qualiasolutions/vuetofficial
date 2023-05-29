/*
  TaskCalendar - this is a calendar component for displaying tasks (and periods)
*/

import CalendarTaskDisplay from './components/CalendarTaskDisplay';
import GenericError from 'components/molecules/GenericError';
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
import { useTranslation } from 'react-i18next';
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
import { MinimalScheduledTask } from './components/Task';
import MonthSelector from './components/MonthSelector';

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

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%'
  }
});

type CalendarProps = {
  taskFilters: ((task: MinimalScheduledTask) => boolean)[];
  periodFilters: ((period: ParsedPeriod) => boolean)[];
  fullPage: boolean;
};
function Calendar({ taskFilters, periodFilters, fullPage }: CalendarProps) {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);

  const dispatch = useDispatch();

  const currentDate = new Date();

  const { periods: allScheduledPeriods, isLoading: isLoadingPeriods } =
    useScheduledPeriods();

  // Load all scheduled tasks
  const {
    data: allScheduledTasks,
    error,
    isLoading: isLoadingScheduledTasks,
    isFetching: isFetchingScheduledTasks
  } = useGetAllScheduledTasksQuery(
    {
      start_datetime: getOffsetMonthStartDateString(currentDate, -24)
        .dateString,
      end_datetime: getOffsetMonthStartDateString(currentDate, 24).dateString
    },
    { skip: !userDetails?.user_id }
  );

  const minimalScheduledTasks = useMemo(() => {
    return allScheduledTasks?.map((task) => ({
      id: task.id,
      start_datetime: new Date(task.start_datetime),
      end_datetime: new Date(task.end_datetime),
      title: task.title,
      members: task.members,
      recurrence_index: task.recurrence_index,
      recurrence: task.recurrence,
      entities: task.entities,
      resourcetype: task.resourcetype
    }));
  }, [allScheduledTasks]);

  const parsedPeriods = useMemo(() => {
    if (!allScheduledPeriods) {
      return [];
    }
    return allScheduledPeriods.map((period) => parsePeriodResponse(period));
  }, [allScheduledPeriods]);

  const filteredTasks = useMemo<MinimalScheduledTask[]>(() => {
    if (!minimalScheduledTasks) {
      return [];
    }
    let filtered: MinimalScheduledTask[] = minimalScheduledTasks;
    for (const taskFilter of taskFilters) {
      filtered = filtered.filter(taskFilter);
    }
    return filtered;
  }, [JSON.stringify(minimalScheduledTasks), taskFilters]);

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
  }, [JSON.stringify(parsedPeriods), periodFilters]);

  const listView = useMemo(() => {
    if (error) {
      return () => null;
    }
    if (!filteredTasks || !filteredAllPeriods) {
      return () => null;
    }

    return () => (
      <TransparentView style={{ marginBottom: 150 }}>
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
  }, [JSON.stringify(filteredTasks), JSON.stringify(filteredAllPeriods)]);

  const calendarView = useMemo(() => {
    if (error) {
      return () => null;
    }
    if (!allScheduledTasks || !allScheduledPeriods) {
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
  }, [JSON.stringify(filteredTasks), JSON.stringify(filteredAllPeriods)]);

  if (error) {
    return <GenericError />;
  }

  const isLoading = isLoadingScheduledTasks || isLoadingPeriods;
  if (
    // If we include this then every time we poll for changes
    // we get a loading spinner - try and figure out how to
    // resolve this
    isLoading ||
    !allScheduledTasks ||
    !allScheduledPeriods
  ) {
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
