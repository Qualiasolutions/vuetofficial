/*
  TaskCalendar - this is a calendar component for displaying tasks (and periods)
*/

import CalendarTaskDisplay from './components/CalendarTaskDisplay/CalendarTaskDisplay';
import GenericError from 'components/molecules/GenericError';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { useGetAllScheduledTasksQuery, useGetAllTasksQuery } from 'reduxStore/services/api/tasks';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import {
  TransparentView,
  WhiteContainerView,
  WhiteView
} from 'components/molecules/ViewComponents';
import { AlmostBlackText, BlackText } from 'components/molecules/TextComponents';
import dayjs from 'dayjs';
import { FullPageSpinner } from 'components/molecules/Spinners';
import utc from 'dayjs/plugin/utc';
import { TaskResponseType } from 'types/tasks';
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
  periodFilters: ((task: PeriodResponse) => boolean)[];
};
function Calendar({ taskFilters, periodFilters }: CalendarProps) {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const currentMonth = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }`;

  const { t } = useTranslation()

  const {
    data: allTasks,
    isLoading: isLoadingAllTasks,
  } = useGetAllTasksQuery(userDetails?.user_id || -1, {
    skip: !userDetails?.user_id
  });

  const currentDate = new Date();
  const [shownMonth, setShownMonth] = React.useState<Date>(
    getOffsetMonthStartDateString(currentDate, 0).date
  );

  const allPeriods = useScheduledPeriods(
    getOffsetMonthStartDateString(shownMonth, 0).dateString,
    getOffsetMonthStartDateString(shownMonth, 1).dateString
  );

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
  useScheduledPeriods(
    getOffsetMonthStartDateString(shownMonth, -1).dateString,
    getOffsetMonthStartDateString(shownMonth, 0).dateString
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
  useScheduledPeriods(
    getOffsetMonthStartDateString(shownMonth, 1).dateString,
    getOffsetMonthStartDateString(shownMonth, 2).dateString
  );

  const filteredAllTasks = useMemo(() => {
    if (!allTasks) {
      return [];
    }
    let filtered = Object.values(allTasks.byId);
    for (const taskFilter of taskFilters) {
      filtered = filtered.filter(taskFilter);
    }
    return filtered;
  }, [allTasks, taskFilters])

  const filteredTasks = useMemo(() => {
    if (!allScheduledTasks) {
      return [];
    }
    let filtered = allScheduledTasks;
    for (const taskFilter of taskFilters) {
      filtered = filtered.filter(taskFilter);
    }
    return filtered;
  }, [allScheduledTasks, taskFilters]);

  const filteredPeriods = useMemo(() => {
    if (!allPeriods) {
      return [];
    }
    let filtered = allPeriods;
    for (const periodFilter of periodFilters) {
      filtered = filtered.filter(periodFilter);
    }
    return filtered;
  }, [allPeriods, periodFilters]);

  
  if (error) {
    return <GenericError />;
  }

  const isLoading = isLoadingScheduledTasks || isLoadingAllTasks

  if (isLoading || !allScheduledTasks || !allPeriods) {
    return <FullPageSpinner />;
  }
  
  if (filteredAllTasks && (filteredAllTasks.length === 0)) {
    return <WhiteContainerView>
      <AlmostBlackText text={t("components.calendar.noTasks")} style={{fontSize: 20}}/>
    </WhiteContainerView>
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
        tasks={filteredTasks}
        periods={filteredPeriods}
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
