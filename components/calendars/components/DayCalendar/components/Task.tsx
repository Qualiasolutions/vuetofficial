import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from 'components/Themed';
import {
  isFixedTaskParsedType,
  ScheduledTaskParsedType
} from 'types/tasks';
import { getTimeStringFromDateObject } from 'utils/datesAndTimes';
import Checkbox from 'expo-checkbox';
import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import {
  selectAccessToken,
  selectUsername
} from 'reduxStore/slices/auth/selectors';
import Constants from 'expo-constants';
import SquareButton from 'components/molecules/SquareButton';
import { useNavigation } from '@react-navigation/native';
import { RootTabParamList } from 'types/base';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import TaskCompletionForm from 'components/forms/TaskCompletionForms/TaskCompletionForm';
import { useGetUserDetailsQuery, useGetUserFullDetailsQuery } from 'reduxStore/services/api/user';
import { useUpdateTaskMutation } from 'reduxStore/services/api/tasks';
import { useCreateTaskCompletionFormMutation } from 'reduxStore/services/api/taskCompletionForms';

import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import GenericError from 'components/molecules/GenericError';
import ColourBar from '../../../../molecules/ColourBar';
import ColourBarContainer from 'components/molecules/ColourBarContainer';
import { UserFullResponse } from 'types/users';

const vuetApiUrl = Constants.manifest?.extra?.vuetApiUrl;

type PropTypes = {
  task: ScheduledTaskParsedType;
  selected: boolean;
  onPress: Function;
};

export default function Task({ task, selected, onPress }: PropTypes) {
  const jwtAccessToken = useSelector(selectAccessToken);
  const username = useSelector(selectUsername);

  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const [showTaskForm, setShowTaskCompletionForm] = useState<boolean>(false);

  const { data: userDetails } = useGetUserDetailsQuery(username);
  const { data: userFullDetails } = useGetUserFullDetailsQuery(userDetails?.user_id || -1);

  function getMemberColourByIdFromUserDetails(id: number, user: UserFullResponse) {
    if(id === user.id) {
        return user.member_colour
    } else {
        const colour = user.family.users.find(x=> x.id === id)?.member_colour
        return colour || ""; 
    }
}  

  const colourHexcodes = [];

  const [triggerCreateCompletionForm, createCompletionFormResult] =
    useCreateTaskCompletionFormMutation();

  const {
    data: allEntities,
    isLoading,
    error
  } = useGetAllEntitiesQuery(userDetails?.user_id || -1);

  const [triggerUpdateTask, updateTaskResult] = useUpdateTaskMutation();

  if (isLoading || !allEntities) {
    return null;
  }

  if (error) {
    return <GenericError />;
  }

  const entity = allEntities.byId[task.entity];

  colourHexcodes.push(getMemberColourByIdFromUserDetails(entity.owner, userFullDetails!));
  task.members.forEach((id: number) => {1
    colourHexcodes.push(getMemberColourByIdFromUserDetails(id, userFullDetails!));
  });

  const addDays = (numDays = 1) => {
    if (isFixedTaskParsedType(task)) {
      const newStart = new Date(task.start_datetime);
      newStart.setDate(newStart.getDate() + numDays);

      const newEnd = new Date(task.end_datetime);
      newEnd.setDate(newEnd.getDate() + numDays);

      /* TODO - handle errors */
      triggerUpdateTask({
        id: task.id,
        start_datetime: newStart,
        end_datetime: newEnd,
        resourcetype: task.resourcetype
      });
    }
  };

  const leftInfo = (
    <View style={styles.leftInfo}>
      <Text> {getTimeStringFromDateObject(task.start_datetime)} </Text>
      <Text> {getTimeStringFromDateObject(task.end_datetime)} </Text>
    </View>
  );

  const expandedHeader =
    entity && selected ? (
      <View style={styles.expandedHeader}>
        <Text style={styles.expandedTitle}>{entity?.name}</Text>
        <SquareButton
          fontAwesomeIconName="eye"
          onPress={() =>
            navigation.navigate('EntityScreen', { entityId: entity.id })
          }
          buttonStyle={{ backgroundColor: 'transparent' }}
        />
      </View>
    ) : null;

  const expandedOptions = selected ? (
    <View style={styles.expandedOptions}>
      <View style={styles.expandedButtons}>
        <SquareButton
          fontAwesomeIconName="pencil"
          onPress={() => navigation.navigate('EditTask', { taskId: task.id })}
        ></SquareButton>
        <SquareButton
          buttonText="+1 Day"
          onPress={() => {
            addDays(1);
          }}
        ></SquareButton>
        <SquareButton
          buttonText="+1 Week"
          onPress={() => {
            addDays(7);
          }}
        ></SquareButton>
      </View>
    </View>
  ) : null;

  const taskTypesRequiringForm = ['BookMOTTask'];
  const taskCompletionForm =
    taskTypesRequiringForm.includes(task.resourcetype) && showTaskForm ? (
      <TaskCompletionForm
        task={task}
        title={'Please provide some details regarding your MOT appointment'}
        onSubmitSuccess={() => setShowTaskCompletionForm(false)}
      />
    ) : null;

  return (
    <View style={styles.container}>
      {expandedHeader}
      <View style={styles.touchableContainerWrapper}>
        <TouchableOpacity
          style={styles.touchableContainer}
          onPress={() => {
            onPress(task);
          }}
        >
          {leftInfo}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{task.title}</Text>
          </View>
        </TouchableOpacity>
        <Checkbox
          style={styles.checkbox}
          disabled={task.is_complete}
          value={task.is_complete}
          onValueChange={(newValue) => {
            if (taskTypesRequiringForm.includes(task.resourcetype)) {
              return setShowTaskCompletionForm(true);
            }
            triggerCreateCompletionForm({
              resourcetype: `${task.resourcetype}CompletionForm`,
              recurrence_index: task.recurrence_index,
              task: task.id
            });
          }}
        />
      </View>
      {taskCompletionForm}
      {expandedOptions}
      <View style={styles.separator}></View>
        <ColourBarContainer>
          {colourHexcodes.map((colour: string)=> {
            return <ColourBar colourHex={colour} />
          })}
        </ColourBarContainer>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%'
  },
  titleContainer: {
    width: '40%'
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'left'
  },
  leftInfo: {
    width: '20%',
    marginRight: 30
  },
  touchableContainerWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  touchableContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%'
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
