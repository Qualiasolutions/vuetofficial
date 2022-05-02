import { StyleSheet } from 'react-native';
import { Text, View } from 'components/Themed';
import {
  TaskParsedType,
  isFixedTaskParsedType,
  isFlexibleTaskParsedType,
  FixedTaskResponseType
} from 'types/tasks';
import { getTimeStringFromDateObject } from 'utils/datesAndTimes';
import Checkbox from 'expo-checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { setTaskCompletion } from 'reduxStore/slices/tasks/actions';
import React from 'react';
import {
  isSuccessfulResponseType,
  makeAuthorisedRequest
} from 'utils/makeAuthorisedRequest';
import { selectAccessToken } from 'reduxStore/slices/auth/selectors';
import Constants from 'expo-constants';

const vuetApiUrl = Constants.manifest?.extra?.vuetApiUrl;

type PropTypes = {
  task: TaskParsedType;
};

export default function Task({ task }: PropTypes) {
  const dispatch = useDispatch();
  const jwtAccessToken = useSelector(selectAccessToken);

  const leftInfo = isFixedTaskParsedType(task) ? (
    <View style={styles.leftInfo}>
      <Text> {getTimeStringFromDateObject(task.start_datetime)} </Text>
      <Text> {getTimeStringFromDateObject(task.end_datetime)} </Text>
    </View>
  ) : (
    <View style={styles.leftInfo}>
      <Text> DUE DATE </Text>
    </View>
  );

  return (
    <View>
      <View style={styles.container}>
        {leftInfo}
        <Text style={styles.title}> {task.title} </Text>
        <Checkbox
          style={styles.checkbox}
          disabled={false}
          value={task.is_complete}
          onValueChange={(newValue) => {
            makeAuthorisedRequest<FixedTaskResponseType>(
              jwtAccessToken,
              `http://${vuetApiUrl}/core/task/${task.id}/`,
              { resourcetype: task.resourcetype, is_complete: true },
              'PATCH'
            ).then((res) => {
              if (res.success) {
                dispatch(
                  setTaskCompletion({
                    taskId: task.id,
                    value: newValue
                  })
                );
              } else {
                /* TODO - handle errors */
                console.log(res);
                console.log(res.response);
              }
            });
          }}
        />
      </View>
      <View style={styles.separator}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold'
  },
  leftInfo: {
    marginRight: 20
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  checkbox: {
    margin: 10,
    height: 25,
    width: 25
  },
  separator: {
    marginTop: 20,
    height: 1,
    width: '100%',
    backgroundColor: '#eee'
  }
});
