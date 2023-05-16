import React, { useMemo, useRef, useState } from 'react';
import { TransparentView } from 'components/molecules/ViewComponents';
import CalendarView from 'components/molecules/CalendarView';
import Tabs from 'components/molecules/Tabs';
import Periods, { PeriodData } from './components/Periods';
import { getUTCValuesFromDateString, getTimeStringFromDateObject, getDateStringFromDateObject } from 'utils/datesAndTimes';
import { FullPageSpinner } from 'components/molecules/Spinners';
import useScheduledPeriods from 'hooks/useScheduledPeriods';
import { PeriodResponse } from 'types/periods';
import { useThemeColor } from 'components/Themed';
import { placeOverlappingPeriods } from 'utils/calendars';
import { useGetAllScheduledTasksQuery } from 'reduxStore/services/api/tasks';
import dayjs from 'dayjs';
import getUserFullDetails from 'hooks/useGetUserDetails';
import { ScheduledTaskParsedType, ScheduledTaskResponseType, TaskResponseType } from 'types/tasks';

const parseTaskResponse = (
  res: ScheduledTaskResponseType
): ScheduledTaskParsedType => {
  return {
    ...res,
    end_datetime: new Date(res.end_datetime),
    start_datetime: new Date(res.start_datetime)
  };
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

type HomeCalendarProps = {
  taskFilters: ((task: TaskResponseType) => boolean)[];
  periodFilters: ((period: PeriodResponse) => boolean)[];
};

function HomeCalendar({
  taskFilters = [],
  periodFilters = [],
}: HomeCalendarProps) {
  const { periods: allPeriods, reminders: allReminders } = useScheduledPeriods();
  const { data: userDetails } = getUserFullDetails()
  const dateToView = useRef<string | null>(null)
  const setDateToView = (date: string) => {
    dateToView.current = date
  }

  const currentDate = new Date();

  const {
    data: allScheduledTasks,
    error: getTasksError,
    isLoading: isLoadingScheduledTasks,
    isFetching: isFetchingScheduledTasks
  } = useGetAllScheduledTasksQuery(
    {
      start_datetime: getOffsetMonthStartDateString(currentDate, -24)
        .dateString,
      end_datetime: getOffsetMonthStartDateString(currentDate, 24).dateString,
      user_id: userDetails?.id || -1
    },
    { skip: !userDetails?.id }
  );

  const periodColour = useThemeColor({}, 'mediumLightGrey');

  const filteredTasks = useMemo(() => {
    if (!allScheduledTasks) {
      return [];
    }

    let filtered = allScheduledTasks;
    for (const taskFilter of taskFilters) {
      filtered = filtered.filter(taskFilter);
    }

    return filtered;
  }, [allPeriods]);

  const filteredPeriods = useMemo(() => {
    if (!allPeriods) {
      return [];
    }

    let filtered = allPeriods;
    for (const periodFilter of periodFilters) {
      filtered = filtered.filter(periodFilter);
    }

    return filtered;
  }, [allPeriods]);

  if (!allPeriods || !allScheduledTasks) return <FullPageSpinner />;

  const periodsDates = placeOverlappingPeriods(filteredPeriods, periodColour);

  const tasksData: {
    [key: string]: PeriodData;
  } = {};
  for (const period of filteredPeriods) {
    const periodFormattedData = {
      title: period.title,
      message: "",
      key: `period_${period.id}`,
      date: period.start_date
    };
    if (period.start_date in tasksData) {
      tasksData[period.start_date].push(periodFormattedData);
    } else {
      tasksData[period.start_date] = [periodFormattedData];
    }
  }

  for (const task of filteredTasks) {
    const parsedTask = parseTaskResponse(task)
    const start_time = getTimeStringFromDateObject(parsedTask.start_datetime)
    const end_time = getTimeStringFromDateObject(parsedTask.end_datetime)
    const start_date = getDateStringFromDateObject(parsedTask.start_datetime)

    const taskFormattedData = {
      title: task.title,
      message: `${start_time} - ${end_time}`,
      key: `task_${task.id}`,
      date: start_date
    };
    if (start_date in tasksData) {
      tasksData[start_date].push(taskFormattedData);
    } else {
      tasksData[start_date] = [taskFormattedData];
    }
  }

  const dates = Object.keys(tasksData).sort()
  const formattedTaskData = dates.map((date) => {
    const dateUtcValues = getUTCValuesFromDateString(date);
    const dayName = `${dateUtcValues.day} ${dateUtcValues.monthName} ${dateUtcValues.year}`;
    return {
      title: dayName,
      key: dayName,
      data: tasksData[date],
      date: tasksData[date][0].date
    };
  });

  const tabs = [
    {
      title: 'List',
      component: () => <Periods
        periods={formattedTaskData}
        onChangeFirstDate={setDateToView}
        defaultDate={dateToView.current}
      />
    },
    {
      title: 'Month',
      component: () => <CalendarView
        dates={periodsDates}
        defaultMonth={dateToView.current}
        onChangeDate={setDateToView}
      />
    },
  ];

  return (
    <TransparentView>
      <Tabs tabs={tabs} />
    </TransparentView>
  );
}

export default HomeCalendar;
