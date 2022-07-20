import { ScrollView, StyleSheet } from 'react-native';
import DayCalendar from './components/DayCalendar/DayCalendar';
import React from 'react';

import {
  getDateStringFromDateObject,
  getDateStringsBetween
} from 'utils/datesAndTimes';

import {
  FlexibleTaskResponseType,
  FlexibleTaskParsedType,
  ScheduledTaskResponseType,
  ScheduledTaskParsedType
} from 'types/tasks';
import { SafeAreaView } from 'react-native-safe-area-context';

type SingleDateTasks = {
  tasks: ScheduledTaskParsedType[];
};

type AllDateTasks = { [key: string]: SingleDateTasks };

const parseFixedTaskResponse = (
  res: ScheduledTaskResponseType
): ScheduledTaskParsedType => {
  return {
    ...res,
    end_datetime: new Date(res.end_datetime),
    start_datetime: new Date(res.start_datetime)
  };
};

const parseFlexibleTaskResponse = (
  res: FlexibleTaskResponseType
): FlexibleTaskParsedType => {
  return {
    ...res,
    due_date: new Date(res.due_date)
  };
};

function Calendar({
  tasks,
  alwaysIncludeCurrentDate = false
}: {
  tasks: ScheduledTaskResponseType[];
  alwaysIncludeCurrentDate?: boolean;
}) {
  const [tasksPerDate, setTasksPerDate] = React.useState<AllDateTasks>({});
  const [selectedTaskId, setSelectedTaskId] = React.useState<number | null>(
    null
  );
  const [selectedRecurrenceIndex, setSelectedRecurrenceIndex] = React.useState<
    number | null
  >(null);

  const formatAndSetTasksPerDate = (): void => {
    const newTasksPerDate: AllDateTasks = {};
    for (const task of Object.values(tasks)) {
      const parsedTask: ScheduledTaskParsedType = parseFixedTaskResponse(task);
      const taskDates = getDateStringsBetween(
        parsedTask.start_datetime,
        parsedTask.end_datetime
      );

      for (const taskDate of taskDates) {
        if (newTasksPerDate[taskDate]) {
          newTasksPerDate[taskDate].tasks.push(parsedTask);
        } else {
          newTasksPerDate[taskDate] = {
            tasks: [parsedTask]
          };
        }
      }
    }

    if (alwaysIncludeCurrentDate) {
      const currentDate = new Date();
      const currentDateString = getDateStringFromDateObject(currentDate);
      if (!(currentDateString in newTasksPerDate)) {
        newTasksPerDate[currentDateString] = {
          tasks: []
        };
      }
    }
    setTasksPerDate(newTasksPerDate);
  };

  React.useEffect(formatAndSetTasksPerDate, [tasks]);

  const dayCalendars = Object.keys(tasksPerDate)
    .sort()
    .map((date) => (
      <DayCalendar
        date={date}
        key={date}
        tasks={tasksPerDate[date].tasks}
        selectedTaskId={selectedTaskId}
        selectedRecurrenceIndex={selectedRecurrenceIndex}
        setSelectedTaskId={setSelectedTaskId}
        setSelectedRecurrenceIndex={setSelectedRecurrenceIndex}
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
