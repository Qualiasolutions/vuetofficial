import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { View } from 'components/Themed';
import DayCalendar from './components/DayCalendar/DayCalendar';
import Constants from 'expo-constants';
import React from 'react';

import {
  getDateStringFromDateObject,
  getDateStringsBetween
} from 'utils/datesAndTimes';

import {
  FixedTaskResponseType,
  FixedTaskParsedType,
  FlexibleTaskResponseType,
  FlexibleTaskParsedType,
  TaskParsedType,
  isFixedTaskResponseType,
  isFlexibleTaskResponseType
} from 'types/tasks';

import { useSelector } from 'react-redux';
import { selectAllTasks } from 'reduxStore/slices/tasks/selectors';

const vuetApiUrl = Constants.manifest?.extra?.vuetApiUrl;

type SingleDateTasks = {
  dateObj: Date;
  tasks: TaskParsedType[];
};

type AllDateTasks = { [key: string]: SingleDateTasks };

const parseFixedTaskResponse = (
  res: FixedTaskResponseType
): FixedTaskParsedType => {
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

function CalendarScreen() {
  const [tasksPerDate, setTasksPerDate] = React.useState<AllDateTasks>({});

  const allTasks = useSelector(selectAllTasks);

  const formatAndSetTasksPerDate = (): void => {
    const newTasksPerDate: AllDateTasks = {};
    for (const task of Object.values(allTasks.byId)) {
      if (isFixedTaskResponseType(task)) {
        const parsedTask: FixedTaskParsedType = parseFixedTaskResponse(task);
        const taskDates = getDateStringsBetween(
          getDateStringFromDateObject(parsedTask.start_datetime),
          getDateStringFromDateObject(parsedTask.end_datetime)
        );

        for (const taskDate of taskDates) {
          if (newTasksPerDate[taskDate]) {
            newTasksPerDate[taskDate].tasks.push(parsedTask);
          } else {
            newTasksPerDate[taskDate] = {
              dateObj: new Date(taskDate),
              tasks: [parsedTask]
            };
          }
        }
      } else if (isFlexibleTaskResponseType(task)) {
        const parsedTask: FlexibleTaskParsedType =
          parseFlexibleTaskResponse(task);
        const dueDate = getDateStringFromDateObject(parsedTask.due_date);
        if (newTasksPerDate[dueDate]) {
          newTasksPerDate[dueDate].tasks.push(parsedTask);
        } else {
          newTasksPerDate[dueDate] = {
            dateObj: new Date(parsedTask.due_date),
            tasks: [parsedTask]
          };
        }
      }
    }

    const currentDate = new Date();
    const currentDateString = getDateStringFromDateObject(currentDate);
    if (!(currentDateString in newTasksPerDate)) {
      newTasksPerDate[currentDateString] = {
        dateObj: currentDate,
        tasks: []
      };
    }
    setTasksPerDate(newTasksPerDate);
  };

  React.useEffect(formatAndSetTasksPerDate, [allTasks]);

  const dayCalendars = Object.keys(tasksPerDate)
    .sort()
    .map((date) => (
      <DayCalendar
        date={tasksPerDate[date].dateObj}
        key={date}
        tasks={tasksPerDate[date].tasks}
      />
    ));

  return <ScrollView style={styles.container}>{dayCalendars}</ScrollView>;
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
    height: '100%',
    backgroundColor: 'white'
  },
  spinnerWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default CalendarScreen;
