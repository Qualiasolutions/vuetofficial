import { ScrollView, StyleSheet } from 'react-native';
import DayCalendar from './DayCalendar/DayCalendar';
import React from 'react';

import {
  getDateStringFromDateObject,
  getDateStringsBetween,
  getDateWithoutTimezone
} from 'utils/datesAndTimes';

import {
  ScheduledTaskResponseType,
  ScheduledTaskParsedType
} from 'types/tasks';

import { PeriodResponse, ScheduledReminder } from 'types/periods';
import { placeOverlappingPeriods } from 'utils/calendars';
import { useThemeColor } from 'components/Themed';

type ParsedPeriod = Omit<PeriodResponse, 'end_date' | 'start_date'> & {
  end_date: Date;
  start_date: Date;
};

type ParsedReminder = Omit<ScheduledReminder, 'end_date' | 'start_date'> & {
  end_date: Date;
  start_date: Date;
};

type SingleDateTasks = {
  tasks: ScheduledTaskParsedType[];
  periods: ParsedPeriod[];
  reminders: ParsedReminder[];
};

type AllDateTasks = {
  [key: string]: SingleDateTasks;
};

const parseTaskResponse = (
  res: ScheduledTaskResponseType
): ScheduledTaskParsedType => {
  return {
    ...res,
    end_datetime: new Date(res.end_datetime),
    start_datetime: new Date(res.start_datetime)
  };
};

const parsePeriodResponse = (res: PeriodResponse): ParsedPeriod => {
  return {
    ...res,
    end_date: getDateWithoutTimezone(res.end_date),
    start_date: getDateWithoutTimezone(res.start_date)
  };
};

const parseReminder = (res: ScheduledReminder): ParsedReminder => {
  return {
    ...res,
    end_date: getDateWithoutTimezone(res.end_date),
    start_date: getDateWithoutTimezone(res.start_date)
  };
};

function Calendar({
  tasks,
  periods,
  reminders,
  alwaysIncludeCurrentDate = false
}: {
  tasks: ScheduledTaskResponseType[];
  periods: PeriodResponse[];
  reminders: ScheduledReminder[];
  alwaysIncludeCurrentDate?: boolean;
}) {
  const [tasksPerDate, setTasksPerDate] = React.useState<AllDateTasks>({});

  const primaryColor = useThemeColor({}, 'primary')
  const periodsDates = placeOverlappingPeriods(periods, primaryColor)

  const formatAndSetTasksPerDate = (): void => {
    const newTasksPerDate: AllDateTasks = {};
    for (const task of tasks) {
      const parsedTask = parseTaskResponse(task);
      const taskDates = getDateStringsBetween(
        parsedTask.start_datetime,
        parsedTask.end_datetime
      );

      for (const taskDate of taskDates) {
        if (newTasksPerDate[taskDate]) {
          newTasksPerDate[taskDate].tasks.push(parsedTask);
        } else {
          newTasksPerDate[taskDate] = {
            tasks: [parsedTask],
            periods: [],
            reminders: []
          };
        }
      }
    }

    for (const period of periods) {
      const parsedPeriod = parsePeriodResponse(period);
      const periodDates = getDateStringsBetween(
        parsedPeriod.start_date,
        parsedPeriod.end_date,
        true // Use UTC
      );

      for (const periodDate of periodDates) {
        if (newTasksPerDate[periodDate]) {
          newTasksPerDate[periodDate].periods.push(parsedPeriod);
        } else {
          newTasksPerDate[periodDate] = {
            tasks: [],
            periods: [parsedPeriod],
            reminders: []
          };
        }
      }
    }

    for (const reminder of reminders) {
      const parsedReminder = parseReminder(reminder);
      const reminderDates = getDateStringsBetween(
        parsedReminder.start_date,
        parsedReminder.end_date,
        true // Use UTC
      );

      for (const reminderDate of reminderDates) {
        if (newTasksPerDate[reminderDate]) {
          newTasksPerDate[reminderDate].reminders.push(parsedReminder);
        } else {
          newTasksPerDate[reminderDate] = {
            tasks: [],
            periods: [],
            reminders: [parsedReminder]
          };
        }
      }
    }

    if (alwaysIncludeCurrentDate) {
      const currentDate = new Date();
      const currentDateString = getDateStringFromDateObject(currentDate);
      if (!(currentDateString in newTasksPerDate)) {
        newTasksPerDate[currentDateString] = {
          tasks: [],
          periods: [],
          reminders: []
        };
      }
    }

    setTasksPerDate(newTasksPerDate);
  };

  React.useEffect(formatAndSetTasksPerDate, [
    tasks,
    periods,
    alwaysIncludeCurrentDate
  ]);

  const dayCalendars = Object.keys(tasksPerDate)
    .sort()
    .map((date) => (
      <DayCalendar
        date={date}
        key={date}
        tasks={tasksPerDate[date].tasks}
        periods={tasksPerDate[date].periods}
        reminders={tasksPerDate[date].reminders}
        markedPeriods={periodsDates[date]}
        highlight={date === getDateStringFromDateObject(new Date())}
      />
    ));

  return <ScrollView style={styles.container}>{dayCalendars}</ScrollView>;
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    width: '100%',
    height: '100%'
  },
  spinnerWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Calendar;
