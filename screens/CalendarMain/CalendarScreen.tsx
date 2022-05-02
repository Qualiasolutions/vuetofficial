import { StyleSheet } from 'react-native';
import { Text, View } from 'components/Themed';
import DayCalendar from './components/DayCalendar/DayCalendar';
import {
  makeAuthorisedRequest,
  SuccessfulResponseType,
  isSuccessfulResponseType
} from 'utils/makeAuthorisedRequest';
import { EntireState } from 'reduxStore/types';
import Constants from 'expo-constants';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from '@reduxjs/toolkit';

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

import { setAllTasks } from 'reduxStore/slices/tasks/actions';
import { SetAllTasksReducerActionType } from 'reduxStore/slices/tasks/types';

const vuetApiUrl = Constants.manifest?.extra?.vuetApiUrl;

type CalendarProps = {
  jwtAccessToken: string;
  allTasks: TaskParsedType[];
  setAllTasksProp: Function;
};

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

function CalendarScreen({
  jwtAccessToken,
  allTasks,
  setAllTasksProp
}: CalendarProps) {
  const [loadingTasks, setLoadingTasks] = React.useState<boolean>(true);
  const [tasksPerDate, setTasksPerDate] = React.useState<AllDateTasks>({});

  // Gets all tasks and sets them in the redux store - is this the best place to do this?
  const getAllTasks = (): void => {
    setLoadingTasks(true);
    makeAuthorisedRequest<TaskResponseType[]>(
      jwtAccessToken,
      `http://${vuetApiUrl}/core/task/`
    ).then((res) => {
      if (isSuccessfulResponseType(res)) {
        setAllTasksProp(res.response);
        setLoadingTasks(false);
      }
    });
  };
  React.useEffect(getAllTasks, []);

  const formatAndSetTasksPerDate = (): void => {
    const newTasksPerDate: AllDateTasks = {};
    for (const task of allTasks) {
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

  const dayCalendars = Object.keys(tasksPerDate).map((date) => (
    <DayCalendar
      date={tasksPerDate[date].dateObj}
      key={date}
      tasks={tasksPerDate[date].tasks}
    />
  ));

  const pageContent = loadingTasks ? <Text>...</Text> : dayCalendars;

  return <View style={styles.container}>{pageContent}</View>;
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  }
});

const mapStateToProps = (state: EntireState) => ({
  jwtAccessToken: state.authentication.jwtAccessToken,
  allTasks: state.tasks.allTasks
});

const mapDispatchToProps = (
  dispatch: Dispatch<SetAllTasksReducerActionType>
) => {
  return bindActionCreators(
    {
      setAllTasksProp: setAllTasks
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CalendarScreen);
