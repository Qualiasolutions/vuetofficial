import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { Text, View } from 'components/Themed';
import DayCalendar from './components/DayCalendar/DayCalendar';
import {
  makeAuthorisedRequest,
  isSuccessfulResponseType
} from 'utils/makeAuthorisedRequest';
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
  TaskResponseType,
  TaskParsedType,
  isFixedTaskResponseType,
  isFlexibleTaskResponseType
} from 'types/tasks';

import { selectAccessToken } from 'reduxStore/slices/auth/selectors';

import { setAllTasks } from 'reduxStore/slices/tasks/actions';
import { useDispatch, useSelector } from 'react-redux';
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
  const [loadingTasks, setLoadingTasks] = React.useState<boolean>(true);
  const [tasksPerDate, setTasksPerDate] = React.useState<AllDateTasks>({});

  const dispatch = useDispatch();
  const jwtAccessToken = useSelector(selectAccessToken);
  const allTasks = useSelector(selectAllTasks);

  // Gets all tasks and sets them in the redux store - is this the best place to do this?
  const getAllTasks = (): void => {
    setLoadingTasks(true);
    makeAuthorisedRequest<TaskResponseType[]>(
      jwtAccessToken,
      `http://${vuetApiUrl}/core/task/`
    ).then((res) => {
      if (isSuccessfulResponseType<TaskResponseType[]>(res)) {
        dispatch(setAllTasks(res.response));
        setLoadingTasks(false);
      }
    });
  };
  React.useEffect(getAllTasks, []);

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

  const loadingScreen = (
    <View style={styles.spinnerWrapper}>
      <ActivityIndicator size="large" />
    </View>
  );

  const pageContent = loadingTasks ? loadingScreen : dayCalendars;

  return <ScrollView style={styles.container}> {pageContent} </ScrollView>;
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
