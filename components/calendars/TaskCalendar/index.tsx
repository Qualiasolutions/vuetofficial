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
import { PeriodResponse, ScheduledReminder } from 'types/periods';
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
  reminderFilters: ((period: ScheduledReminder) => boolean)[];
};
function Calendar({
  taskFilters,
  periodFilters,
  reminderFilters
}: CalendarProps) {
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

  const { periods: allScheduledPeriods, reminders: allScheduledReminders } =
    useScheduledPeriods();

  // Load all scheduled tasks
  const {
    data: allScheduledTasks,
    error,
    isLoading: isLoadingScheduledTasks,
  } = useGetAllScheduledTasksQuery(
    {
      start_datetime: getOffsetMonthStartDateString(shownMonth, -24).dateString,
      end_datetime: getOffsetMonthStartDateString(shownMonth, 24).dateString,
      user_id: userDetails?.user_id || -1
    },
    {
      skip: !userDetails?.user_id,
      pollingInterval: 30000
    }
  );

  type FilteredTasksDict = {
    allTasks: TaskResponseType[];
    allScheduledTasks: ScheduledTaskResponseType[];
  }

  const tasksToFilter: FilteredTasksDict = {
    allTasks: allTasks ? Object.values(allTasks.byId) : [],
    allScheduledTasks: allScheduledTasks || []
  };

  const filteredTasks = useMemo<FilteredTasksDict>(() => {
    const filtered: FilteredTasksDict = {
      allTasks: [],
      allScheduledTasks: []
    };
    const tasks = tasksToFilter["allTasks"];
    if (tasks) {
      filtered["allTasks"] = tasks;
      for (const taskFilter of taskFilters) {
        filtered["allTasks"] = filtered["allTasks"].filter(taskFilter);
      }
    }
    const scheduledTasks = tasksToFilter["allScheduledTasks"];
    if (scheduledTasks) {
      filtered["allScheduledTasks"] = scheduledTasks;
      for (const taskFilter of taskFilters) {
        filtered["allScheduledTasks"] = filtered["allScheduledTasks"].filter(taskFilter);
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

  const filteredAllReminders = useMemo<ScheduledReminder[]>(() => {
    if (!allScheduledReminders) {
      return [];
    } else {
      let filtered = allScheduledReminders;
      for (const reminderFilter of reminderFilters) {
        filtered = filtered.filter(reminderFilter);
      }
      return filtered;
    }
  }, [allScheduledReminders, reminderFilters]);

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

  const filteredMonthReminders = useMemo(() => {
    return filteredAllReminders
      .filter((reminder) => {
        const reminderStartDate = new Date(reminder.start_date);
        const reminderEndDate = new Date(reminder.end_date);

        return (
          reminderStartDate.getFullYear() <= shownMonth.getFullYear() &&
          reminderStartDate.getMonth() <= shownMonth.getMonth() &&
          reminderEndDate.getFullYear() >= shownMonth.getFullYear() &&
          reminderEndDate.getMonth() >= shownMonth.getMonth()
        );
      })
      .filter(
        (reminder) =>
          new Date(reminder.end_date).getMonth() === shownMonth.getMonth()
      );
  }, [filteredAllReminders, shownMonth]);

  const noTasks = useMemo(() => {
    return (
      filteredAllPeriods &&
      filteredAllReminders &&
      filteredAllPeriods.length === 0 &&
      filteredAllReminders.length === 0
    );
  }, [filteredTasks, filteredAllPeriods, filteredAllReminders]);

  useEffect(() => {
    if (!noTasks) {
      const futurePeriods = filteredAllPeriods.filter(
        (period) => new Date(period.start_date) > new Date()
      );
      const pastPeriods = filteredAllPeriods.filter(
        (period) => new Date(period.end_date) <= new Date()
      );

      const futureReminders = filteredAllReminders.filter(
        (reminder) => new Date(reminder.start_date) > new Date()
      );
      const pastReminders = filteredAllReminders.filter(
        (reminder) => new Date(reminder.end_date) <= new Date()
      );

      const timeNow = new Date()
      const futureTasks = filteredTasks.allScheduledTasks
        .filter(task => new Date(task.start_datetime) > timeNow)
        .sort((a, b) => {
          return new Date(b.startTime) < new Date(a.startTime) ? 1 : -1;
        })
      const pastTasks = filteredTasks.allScheduledTasks
        .filter(task => new Date(task.start_datetime) > timeNow)
        .sort((a, b) => {
          return new Date(b.startTime) < new Date(a.startTime) ? -1 : 1;
        })

      if (
        futureTasks.length > 0 ||
        futurePeriods.length > 0 ||
        futureReminders.length > 0
      ) {
        const firstScheduledTask = futureTasks[0];
        const firstScheduledPeriod = futurePeriods[0];
        const firstScheduledReminder = futureReminders[0];

        const startTimes = [
          {
            type: 'TASK',
            startTime:
              firstScheduledTask && new Date(firstScheduledTask.start_datetime)
          },
          {
            type: 'PERIOD',
            startTime:
              firstScheduledPeriod && new Date(firstScheduledPeriod.start_date)
          },
          {
            type: 'REMINDER',
            startTime:
              firstScheduledReminder &&
              new Date(firstScheduledReminder.start_date)
          }
        ].sort((a, b) => {
          if (!b.startTime) return -1;
          if (!a.startTime) return 1;
          return b.startTime < a.startTime ? 1 : -1;
        });
        const firstType = startTimes[0].type;

        if (firstType === 'TASK') {
          setShownMonth(
            getOffsetMonthStartDateString(
              new Date(firstScheduledTask.start_datetime),
              0
            ).date
          );
        } else if (firstType === 'PERIOD') {
          setShownMonth(
            getOffsetMonthStartDateString(
              new Date(firstScheduledPeriod.start_date),
              0
            ).date
          );
        } else {
          setShownMonth(
            getOffsetMonthStartDateString(
              new Date(firstScheduledReminder.start_date),
              0
            ).date
          );
        }
      } else if (
        pastTasks.length > 0 ||
        pastPeriods.length > 0 ||
        pastReminders.length > 0
      ) {
        const lastScheduledTask = pastTasks[0];
        const lastScheduledPeriod = pastPeriods[pastPeriods.length - 1];
        const lastScheduledReminder =
          futureReminders[futureReminders.length - 1];

        const endTimes = [
          {
            type: 'TASK',
            startTime:
              lastScheduledTask && new Date(lastScheduledTask.end_datetime)
          },
          {
            type: 'PERIOD',
            startTime:
              lastScheduledPeriod && new Date(lastScheduledPeriod.end_date)
          },
          {
            type: 'REMINDER',
            startTime:
              lastScheduledReminder && new Date(lastScheduledReminder.end_date)
          }
        ].sort((a, b) => {
          if (!a.startTime) return 1;
          if (!b.startTime) return -1;
          return b.startTime < a.startTime ? -1 : 1;
        });
        const lastType = endTimes[0].type;

        if (lastType === 'TASK') {
          setShownMonth(
            getOffsetMonthStartDateString(
              new Date(lastScheduledTask.end_datetime),
              0
            ).date
          );
        } else if (lastType === 'PERIOD') {
          setShownMonth(
            getOffsetMonthStartDateString(
              new Date(lastScheduledPeriod.end_date),
              0
            ).date
          );
        } else {
          setShownMonth(
            getOffsetMonthStartDateString(
              new Date(lastScheduledReminder.end_date),
              0
            ).date
          );
        }
      }
    }
  }, [
    noTasks,
    filteredAllPeriods.length,
    filteredAllReminders.length,
  ]);

  if (error) {
    return <GenericError />;
  }

  const isLoading =
    isLoadingScheduledTasks ||
    isLoadingAllTasks

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
      <CalendarTaskDisplay
        tasks={filteredTasks.allScheduledTasks}
        periods={filteredMonthPeriods}
        reminders={filteredMonthReminders}
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
    width: '100%',
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
