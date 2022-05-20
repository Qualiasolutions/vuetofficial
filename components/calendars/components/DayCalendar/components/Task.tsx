import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from 'components/Themed';
import {
  TaskParsedType,
  isFixedTaskParsedType,
  isFlexibleTaskParsedType,
  FixedTaskResponseType,
  isFixedTaskResponseType
} from 'types/tasks';
import { getTimeStringFromDateObject } from 'utils/datesAndTimes';
import Checkbox from 'expo-checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { setTaskById, setTaskCompletion } from 'reduxStore/slices/tasks/actions';
import React from 'react';
import {
  isSuccessfulResponseType,
  makeAuthorisedRequest
} from 'utils/makeAuthorisedRequest';
import { selectAccessToken } from 'reduxStore/slices/auth/selectors';
import Constants from 'expo-constants';
import SquareButton from 'components/molecules/SquareButton';
import { selectEntityById } from 'reduxStore/slices/entities/selectors';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList, RootStackScreenProps, RootTabParamList, RootTabScreenProps } from 'types/base';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { makeApiUrl } from 'utils/urls';

const vuetApiUrl = Constants.manifest?.extra?.vuetApiUrl;

type PropTypes = {
  task: TaskParsedType;
  selected: boolean;
  onPress: Function;
};

export default function Task({ task, selected, onPress }: PropTypes) {
  const dispatch = useDispatch();
  const jwtAccessToken = useSelector(selectAccessToken);
  const entity = useSelector(selectEntityById(task.entity));

  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  const addDays = (numDays=1) => {
    if (isFixedTaskParsedType(task)) {
      const newStart = new Date(task.start_datetime)
      newStart.setDate(newStart.getDate() + numDays)

      const newEnd = new Date(task.end_datetime)
      newStart.setDate(newEnd.getDate() + numDays)

      makeAuthorisedRequest<FixedTaskResponseType>(jwtAccessToken, makeApiUrl(`/core/task/${task.id}`), {
        start_datetime: newStart,
        end_datetime: newStart,
        resourcetype: task.resourcetype
      }, 'PATCH').then(res => {
        if (isSuccessfulResponseType(res)) {
          if (isFixedTaskResponseType(res.response)) {
            dispatch(setTaskById({
              taskId: task.id,
              value: res.response
            }))
          }
        } else {
          /* TODO - handle errors */
          console.log(res);
        }
      })
    }
  }

  const leftInfo = isFixedTaskParsedType(task) ? (
    <View style={styles.leftInfo}>
      <Text> {getTimeStringFromDateObject(task.start_datetime)} </Text>
      <Text> {getTimeStringFromDateObject(task.end_datetime)} </Text>
    </View>
  ) : (
    <View style={styles.leftInfo}>
      <Text> DUE </Text>
    </View>
  );

  const expandedHeader = selected ? (
    <View style={styles.expandedHeader}>
      <Text style={styles.expandedTitle}>{entity.name}</Text>
      <SquareButton
        fontAwesomeIconName='eye'
        onPress={() => navigation.navigate(
          'EntityScreen',
          {entityId: String(entity.id)})
        }
        buttonStyle={{backgroundColor: 'transparent'}}
      />
    </View>
  ) : null

  const expandedOptions = selected ? (
    <View style={styles.expandedOptions}>
      {/* {task.description? <Text> DESCRIPTION </Text> : null} */}
      <View style={styles.expandedButtons}>
        <SquareButton fontAwesomeIconName='pencil' onPress={() => {}/* navigation.navigate('EditTask') */}></SquareButton>
        <SquareButton buttonText='+1 Day' onPress={() => { addDays(1) }}></SquareButton>
        <SquareButton buttonText='+1 Week' onPress={() => { addDays(7) }}></SquareButton>
      </View>
    </View>
  ) : null

  return (
    <View>
      {expandedHeader}
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
  expandedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#efefef'
  },
  expandedTitle: {
    fontWeight: 'bold',
    fontSize: 18
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
