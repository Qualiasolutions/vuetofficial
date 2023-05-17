/*
  TaskCalendar - this is a calendar component for displaying tasks (and periods)
*/

import CalendarTaskDisplay from './components/CalendarTaskDisplay/CalendarTaskDisplay';
import GenericError from 'components/molecules/GenericError';
import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { useGetAllScheduledTasksQuery } from 'reduxStore/services/api/tasks';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import {
  TransparentView,
  WhiteContainerView,
  WhiteView
} from 'components/molecules/ViewComponents';
import { AlmostBlackText } from 'components/molecules/TextComponents';
import dayjs from 'dayjs';
import { FullPageSpinner } from 'components/molecules/Spinners';
import utc from 'dayjs/plugin/utc';
import { ScheduledTaskResponseType, TaskResponseType } from 'types/tasks';
import useScheduledPeriods from 'hooks/useScheduledPeriods';
import { PeriodResponse, ScheduledReminder } from 'types/periods';
import { useTranslation } from 'react-i18next';
import CalendarView from 'components/molecules/CalendarView';
import Tabs from 'components/molecules/Tabs';
import { placeOverlappingPeriods } from 'utils/calendars';
import { useThemeColor } from 'components/Themed';

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

  const { t } = useTranslation();

  const [listEnforcedDateToView, setListEnforcedDateToView] = useState<string | null>(null)
  const [monthEnforcedDateToView, setMonthEnforcedDateToView] = useState<string | null>(null)

  const currentDate = new Date();
  const {
    periods: allScheduledPeriods,
    reminders: allScheduledReminders,
    isLoading: isLoadingPeriods
  } = useScheduledPeriods();

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
      end_datetime: getOffsetMonthStartDateString(currentDate, 24).dateString,
      user_id: userDetails?.user_id || -1
    },
    { skip: !userDetails?.user_id }
  );

  const filteredTasks = useMemo<ScheduledTaskResponseType[]>(() => {
    if (!allScheduledTasks) {
      return [];
    }
    let filtered: ScheduledTaskResponseType[] = allScheduledTasks;
    for (const taskFilter of taskFilters) {
      filtered = filtered.filter(taskFilter);
    }
    return filtered;
  }, [allScheduledTasks, taskFilters]);

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

  const noTasks = useMemo(() => {
    return (
      filteredAllPeriods &&
      filteredAllReminders &&
      filteredAllPeriods.length === 0 &&
      filteredAllReminders.length === 0 &&
      filteredTasks.length === 0
    );
  }, [filteredTasks, filteredAllPeriods, filteredAllReminders]);

  const periodColour = useThemeColor({}, 'mediumLightGrey');

  const listView = useMemo(() => {
    if (error) {
      return () => null
    }
    if (!allScheduledTasks || allScheduledPeriods) {
      return () => null
    }
    if (noTasks) {
      return () => null
    }

    return () => (
      <CalendarTaskDisplay
        tasks={filteredTasks}
        periods={filteredAllPeriods}
        reminders={filteredAllReminders}
        alwaysIncludeCurrentDate={true}
        onChangeFirstDate={(date) => {
          setListEnforcedDateToView(date)
        }}
        defaultDate={monthEnforcedDateToView}
      />
    );
  }, [
    JSON.stringify(filteredTasks),
    JSON.stringify(filteredAllPeriods),
    JSON.stringify(filteredAllReminders),
    monthEnforcedDateToView
  ])

  const calendarView = useMemo(() => {
    if (error) {
      return () => null
    }
    if (!allScheduledTasks || allScheduledPeriods) {
      return () => null
    }
    if (noTasks) {
      return () => null
    }

    return () => <CalendarView
      dates={periodsDates}
      defaultMonth={listEnforcedDateToView}
      onChangeDate={(date) => {
        setMonthEnforcedDateToView(date)
      }}
    />
  }, [
    JSON.stringify(filteredTasks),
    JSON.stringify(filteredAllPeriods),
    JSON.stringify(filteredAllReminders),
    listEnforcedDateToView
  ])


  if (error) {
    return <GenericError />;
  }

  const isLoading = isLoadingScheduledTasks || isLoadingPeriods;
  if (
    // If we include this then every time we poll for changes
    // we get a loading spinner - try and figure out how to
    // resolve this
    // isLoading ||
    // isFetchingScheduledTasks ||
    !allScheduledTasks ||
    !allScheduledPeriods
  ) {
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

  const periodsDates = placeOverlappingPeriods(filteredAllPeriods, periodColour);

  const tabs = [
    {
      title: 'List',
      component: listView
    },
    {
      title: 'Month',
      component: calendarView
    },
  ];

  return (
    <TransparentView style={styles.container}>
      <Tabs tabs={tabs} />
    </TransparentView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%'
  }
});

export default Calendar;
