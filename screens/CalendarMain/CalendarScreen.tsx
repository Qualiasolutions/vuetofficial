import { StyleSheet } from 'react-native';
import { Text, View } from 'components/Themed';
import DayCalendar from './components/DayCalendar/DayCalendar';
import { makeAuthorisedRequest, SuccessfulResponseType } from 'utils/makeAuthorisedRequest';
import { EntireState } from 'reduxStore/types';
import Constants from 'expo-constants';
import React from 'react';
import { connect } from 'react-redux';

const vuetApiUrl = Constants.manifest?.extra?.vuetApiUrl;

type CalendarProps = {
  jwtAccessToken: string;
}

type PerDateTasks = {
  dateObj: Date;
  tasks: object[]
}

function CalendarScreen({jwtAccessToken}: CalendarProps) {
  const [loadingTasks, setLoadingTasks] = React.useState<boolean>(true)
  const [tasksPerDate, setTasksPerDate] = React.useState<{[key: string]: PerDateTasks}>({}) // TODO - make this type what it should be

  // TODO - make this return type what it should be
  const getTasksPerDate = (): void => { 
    const currentDate = new Date();
    makeAuthorisedRequest<[]>(jwtAccessToken, `http://${vuetApiUrl}/core/task/`).then(res => {
      const isSuccessfulResponseType = (x: any): x is SuccessfulResponseType<[]> => x.success === true
      if (isSuccessfulResponseType(res)) {
        for (const task of res.response) {
          // TODO
          console.log(task)
        }
        setLoadingTasks(false)
        setTasksPerDate({
          [currentDate.toDateString()]: {
            dateObj: currentDate,
            tasks: []
          }
        })
      }
    })
  }

  React.useEffect(getTasksPerDate, [])

  const dayCalendars = Object.keys(tasksPerDate).map((date) => (
    <DayCalendar date={tasksPerDate[date].dateObj} key={date} />
  ));

  return (
    <View style={styles.container}>
      {dayCalendars}
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%'
  }
});

const mapStateToProps = (state: EntireState) => ({
  jwtAccessToken: state.authentication.jwtAccessToken,
});

export default connect(mapStateToProps, null)(CalendarScreen);
