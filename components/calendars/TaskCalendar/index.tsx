/*
  TaskCalendar - this is a calendar component for displaying tasks (and periods)
*/

import CalendarTaskDisplay from './components/CalendarTaskDisplay/CalendarTaskDisplay';
import GenericError from 'components/molecules/GenericError';
import React, { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import {
  useGetAllScheduledTasksQuery,
  useGetAllTasksQuery
} from 'reduxStore/services/api/tasks';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import {
  TransparentView,
  WhiteContainerView,
  WhiteView
} from 'components/molecules/ViewComponents';
import {
  AlmostBlackText,
  BlackText
} from 'components/molecules/TextComponents';
import dayjs from 'dayjs';
import { FullPageSpinner } from 'components/molecules/Spinners';
import utc from 'dayjs/plugin/utc';
import { ScheduledTaskResponseType, TaskResponseType } from 'types/tasks';
import useScheduledPeriods from 'hooks/useScheduledPeriods';
import { PeriodResponse } from 'types/periods';
import { useTranslation } from 'react-i18next';

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

type CalendarProps = {
  taskFilters: ((task: TaskResponseType) => boolean)[];
  periodFilters: ((period: PeriodResponse) => boolean)[];
};
function Calendar({ taskFilters, periodFilters }: CalendarProps) {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const currentMonth = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }`;

  const { t } = useTranslation();

  const { data: allTasks, isLoading: isLoadingAllTasks } = useGetAllTasksQuery(
    userDetails?.user_id || -1,
    {
      skip: !userDetails?.user_id
    }
  );

  const currentDate = new Date();
  const [shownMonth, setShownMonth] = React.useState<Date>(
    getOffsetMonthStartDateString(currentDate, 0).date
  );

  const allScheduledPeriods = useScheduledPeriods();

  // Load current month
  const {
    data: allScheduledTasks,
    error,
    isLoading: isLoadingScheduledTasks,
    isFetching
  } = useGetAllScheduledTasksQuery(
    {
      start_datetime: getOffsetMonthStartDateString(shownMonth, 0).dateString,
      end_datetime: getOffsetMonthStartDateString(shownMonth, 1).dateString,
      user_id: userDetails?.user_id || -1
    },
    {
      skip: !userDetails?.user_id,
      pollingInterval: 10000
    }
  );

  // Load next 2 years
  const {
    data: next2YearsTasks,
    isLoading: isLoadingNext2YearsScheduledTasks
  } = useGetAllScheduledTasksQuery(
    {
      start_datetime: getOffsetMonthStartDateString(currentDate, 0).dateString,
      end_datetime: getOffsetMonthStartDateString(currentDate, 24).dateString,
      user_id: userDetails?.user_id || -1
    },
    {
      skip: !userDetails?.user_id,
      pollingInterval: 30000
    }
  );

  // Load previous 2 years
  const {
    data: previous2YearsTasks,
    isLoading: isLoadingPrevious2YearsScheduledTasks
  } = useGetAllScheduledTasksQuery(
    {
      start_datetime: getOffsetMonthStartDateString(currentDate, -24)
        .dateString,
      end_datetime: getOffsetMonthStartDateString(currentDate, 0).dateString,
      user_id: userDetails?.user_id || -1
    },
    {
      skip: !userDetails?.user_id,
      pollingInterval: 30000
    }
  );

  // Preload previous month
  useGetAllScheduledTasksQuery(
    {
      start_datetime: getOffsetMonthStartDateString(shownMonth, -1).dateString,
      end_datetime: getOffsetMonthStartDateString(shownMonth, 0).dateString,
      user_id: userDetails?.user_id || -1
    },
    {
      skip: !userDetails?.user_id,
      pollingInterval: 20000
    }
  );

  // Preload next month
  useGetAllScheduledTasksQuery(
    {
      start_datetime: getOffsetMonthStartDateString(shownMonth, 1).dateString,
      end_datetime: getOffsetMonthStartDateString(shownMonth, 2).dateString,
      user_id: userDetails?.user_id || -1
    },
    {
      skip: !userDetails?.user_id,
      pollingInterval: 20000
    }
  );

  const tasksToFilter = {
    allTasks: allTasks ? Object.values(allTasks.byId) : [],
    allScheduledTasks,
    next2YearsTasks,
    previous2YearsTasks
  } as { [key: string]: ScheduledTaskResponseType[] | undefined };

  const filteredTasks = useMemo<{
    [key: string]: ScheduledTaskResponseType[];
  }>(() => {
    const filtered: { [key: string]: ScheduledTaskResponseType[] } = {};
    for (const tasksName in tasksToFilter) {
      const tasks = tasksToFilter[tasksName];
      if (!tasks) {
        filtered[tasksName] = [];
      } else {
        filtered[tasksName] = tasks;
        for (const taskFilter of taskFilters) {
          filtered[tasksName] = filtered[tasksName].filter(taskFilter);
        }
      }
    }
    return filtered;
  }, [tasksToFilter, taskFilters]);

  const filteredAllPeriods = useMemo<PeriodResponse[]>(() => {
    if (!allScheduledPeriods) {
      return [];
    } else {
      let filtered = allScheduledPeriods;
      for (const periodFilter of periodFilters) {
        filtered = filtered.filter(periodFilter);
      }
      return filtered;
    }
  }, [allScheduledPeriods, periodFilters]);

  const filteredMonthPeriods = useMemo(() => {
    return filteredAllPeriods
      .filter((period) => {
        const periodStartDate = new Date(period.start_date);
        const periodEndDate = new Date(period.end_date);

        return (
          periodStartDate.getFullYear() <= shownMonth.getFullYear() &&
          periodStartDate.getMonth() <= shownMonth.getMonth() &&
          periodEndDate.getFullYear() >= shownMonth.getFullYear() &&
          periodEndDate.getMonth() >= shownMonth.getMonth()
        );
      })
      .filter(
        (period) =>
          new Date(period.end_date).getMonth() === shownMonth.getMonth()
      );
  }, [filteredAllPeriods, shownMonth]);

  const noTasks = useMemo(() => {
    return (
      filteredTasks.next2YearsTasks &&
      filteredTasks.previous2YearsTasks &&
      filteredAllPeriods &&
      filteredTasks.next2YearsTasks.length === 0 &&
      filteredTasks.previous2YearsTasks.length === 0 &&
      filteredAllPeriods.length === 0
    );
  }, [filteredTasks, filteredAllPeriods]);

  useEffect(() => {
    if (!noTasks) {
      const futurePeriods = filteredAllPeriods.filter(
        (period) => new Date(period.start_date) > new Date()
      );
      const pastPeriods = filteredAllPeriods.filter(
        (period) => new Date(period.start_date) <= new Date()
      );

      if (
        filteredTasks.next2YearsTasks.length > 0 ||
        futurePeriods.length > 0
      ) {
        const firstScheduledTask = filteredTasks.next2YearsTasks[0];
        const firstScheduledPeriod = futurePeriods[0];

        if (
          firstScheduledTask &&
          (!firstScheduledPeriod ||
            new Date(firstScheduledTask.start_datetime) <
              new Date(firstScheduledPeriod.start_date))
        ) {
          setShownMonth(
            getOffsetMonthStartDateString(
              new Date(firstScheduledTask.start_datetime),
              0
            ).date
          );
        } else {
          setShownMonth(
            getOffsetMonthStartDateString(
              new Date(firstScheduledPeriod.start_date),
              0
            ).date
          );
        }
      } else if (
        filteredTasks.previous2YearsTasks.length > 0 ||
        pastPeriods.length > 0
      ) {
        const lastScheduledTask =
          filteredTasks.previous2YearsTasks[
            filteredTasks.previous2YearsTasks.length - 1
          ];
        const lastScheduledPeriod = pastPeriods[pastPeriods.length - 1];
        if (
          lastScheduledTask &&
          (!lastScheduledPeriod ||
            new Date(lastScheduledTask.end_datetime) >
              new Date(lastScheduledPeriod.end_date))
        ) {
          setShownMonth(
            getOffsetMonthStartDateString(
              new Date(lastScheduledTask.end_datetime),
              0
            ).date
          );
        } else {
          setShownMonth(
            getOffsetMonthStartDateString(
              new Date(lastScheduledPeriod.end_date),
              0
            ).date
          );
        }
      }
    }
  }, [noTasks]);

  if (error) {
    return <GenericError />;
  }

  const isLoading =
    isLoadingScheduledTasks ||
    isLoadingAllTasks ||
    isLoadingNext2YearsScheduledTasks ||
    isLoadingPrevious2YearsScheduledTasks;

  if (isLoading || !allScheduledTasks || !allScheduledPeriods) {
    return <FullPageSpinner />;
  }

  if (noTasks) {
    return (
      <WhiteContainerView>
        <AlmostBlackText
          text={t('components.calendar.noTasks')}
          style={{ fontSize: 20 }}
        />
      </WhiteContainerView>
    );
  }

  return (
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
          <BlackText text="<" style={styles.monthPickerArrow} bold={true} />
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
          <BlackText text=">" style={styles.monthPickerArrow} bold={true} />
        </Pressable>
      </TransparentView>
      <CalendarTaskDisplay
        tasks={filteredTasks.allScheduledTasks}
        periods={filteredMonthPeriods}
        alwaysIncludeCurrentDate={
          currentMonth ===
          `${shownMonth.getFullYear()}-${shownMonth.getMonth() + 1}`
        }
      />
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
    marginHorizontal: 10
  }
});

export default Calendar;
