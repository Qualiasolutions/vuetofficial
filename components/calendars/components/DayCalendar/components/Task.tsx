import { StyleSheet, TouchableOpacity } from 'react-native';
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
  makeAuthorisedRequest
} from 'utils/makeAuthorisedRequest';
import { selectAccessToken } from 'reduxStore/slices/auth/selectors';
import Constants from 'expo-constants';
import SquareButton from 'components/molecules/SquareButton';

const vuetApiUrl = Constants.manifest?.extra?.vuetApiUrl;

type PropTypes = {
  task: TaskParsedType;
  selected: boolean;
  onPress: Function;
};

export default function Task({ task, selected, onPress }: PropTypes) {
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

  const expandedOptions = selected ? (<View style={styles.expandedOptions}>
    {task.description? <Text> DESCRIPTION </Text> : null}
    <View style={styles.expandedButtons}>
      <SquareButton fontAwesomeIconName='pencil' onPress={() => {}/* navigation.navigate('EditTask') */}></SquareButton>
      <SquareButton buttonText='+1 Day' onPress={() => {}/* navigation.navigate('EditTask') */}></SquareButton>
      <SquareButton buttonText='+1 Week' onPress={() => {}/* navigation.navigate('EditTask') */}></SquareButton>
    </View>
  </View>) : null

  return (
    <View>
      <TouchableOpacity style={styles.container} onPress={() => { onPress(task.id) }}>
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
              { resourcetype: task.resourcetype, is_complete: newValue },
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
      </TouchableOpacity>
      {expandedOptions}
      <View style={styles.separator}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    maxWidth: '60%'
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
  },
  expandedOptions: {
    marginTop: 10,
    alignItems: 'flex-end'
  },
  expandedButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});
