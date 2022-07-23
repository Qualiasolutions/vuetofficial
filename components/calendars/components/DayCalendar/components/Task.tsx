import { Image, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from 'components/Themed';
import {
  TaskParsedType,
  isFixedTaskParsedType,
  FixedTaskResponseType,
  isFixedTaskResponseType,
  ScheduledTaskParsedType
} from 'types/tasks';
import { getTimeStringFromDateObject } from 'utils/datesAndTimes';
import Checkbox from 'expo-checkbox';
import { useSelector } from 'react-redux';
import React, { useMemo, useState } from 'react';
import {
  isSuccessfulResponseType,
  makeAuthorisedRequest
} from 'utils/makeAuthorisedRequest';
import {
  selectAccessToken,
  selectUsername
} from 'reduxStore/slices/auth/selectors';
import Constants from 'expo-constants';
import SquareButton from 'components/molecules/SquareButton';
import { useNavigation } from '@react-navigation/native';
import { RootTabParamList } from 'types/base';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { makeApiUrl } from 'utils/urls';
import TaskCompletionForm from 'components/forms/TaskCompletionForms/TaskCompletionForm';
import { useGetUserDetailsQuery, useGetUserFullDetailsQuery } from 'reduxStore/services/api/user';
import { useUpdateTaskMutation } from 'reduxStore/services/api/tasks';
import { useCreateTaskCompletionFormMutation } from 'reduxStore/services/api/taskCompletionForms';

import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import GenericError from 'components/molecules/GenericError';
import Colors from '../../../../../constants/Colors';
import { WhiteText } from 'components/molecules/TextComponents';
import Layout from '../../../../../constants/Layout'
import { Feather } from '@expo/vector-icons';
import { TransparentView } from 'components/molecules/ViewComponents';
import { ColorPicker } from 'components/forms/components/ColorPickers';

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

  const [triggerCreateCompletionForm, createCompletionFormResult] =
    useCreateTaskCompletionFormMutation();

  const {
    data: allEntities,
    isLoading,
    error
  } = useGetAllEntitiesQuery(userDetails?.user_id || -1);

  const {
    data: userFullDetails,
    isLoading: isLoadingFullDetails,
    error: fullDetailsError
  } = useGetUserFullDetailsQuery(userDetails?.user_id || -1);

  const [triggerUpdateTask, updateTaskResult] = useUpdateTaskMutation();

  if (isLoading || !allEntities) {
    return null;
  }

  if (error) {
    return <GenericError />;
  }

  const membersList = userFullDetails?.family?.users?.filter((item:any) => task.members.includes(item.id))

  const entity = allEntities.byId[task.entity];

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
      <Pressable  onPress={() => navigation.navigate('EntityScreen', { entityId: entity.id }) } style={styles.expandedHeader}>
        <WhiteText text={entity?.name} style={styles.expandedTitle} />
        <Image source={require('../../../../../assets/images/edit.png')} style={styles.editImage} />
      </Pressable>
    ) : null;

  const expandedOptions = selected ? (
    <View style={styles.expandedOptions}>
      <View style={styles.expandedButtons}>
        <SquareButton
          buttonText={`+1\nDay`}
          onPress={() => {
            addDays(1);
          }}
          buttonStyle={styles.buttonStyle}
          buttonTextStyle={styles.buttonTextStyle}
          buttonSize={35}
        />
        <SquareButton
          buttonText={'+1\nWeek'}
          onPress={() => {
            addDays(7);
          }}
          buttonStyle={styles.buttonStyle}
          buttonTextStyle={styles.buttonTextStyle}
          buttonSize={35}
        />
        <SquareButton
          customIcon={<Feather name='calendar' color={'#fff'} size={25}/>}
          onPress={() => navigation.navigate('EditTask', { taskId: task.id })}
          buttonStyle={{...styles.buttonStyle, padding: 8}}
        />
      </View>
    </View>
  ) : null;

  const member_color = <TransparentView pointerEvents='none' style={styles.memberColor}>
  {
    membersList?.map(({member_colour}) => {
     return <ColorPicker value={member_colour} onValueChange={()=>{}} height={9} width={83} />
    })
  }
</TransparentView>

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
    <View style={[styles.container,  entity && selected && styles.selectedTask]}>
      {expandedHeader}
      <View style={[styles.touchableContainerWrapper, selected &&  styles.selectedTouchableContainer]}>
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
      {member_color}
      {!selected&&<View style={styles.separator}></View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Layout.window.width - 100
  },
  titleContainer: {
    width: '40%',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'left'
  },
  leftInfo: {
    width: '20%',
    marginRight: 30,
    marginLeft: 13
  },
  touchableContainerWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
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
    paddingHorizontal: 13,
    backgroundColor: Colors.light.primary,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 53
  },
  expandedTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  expandedOptions: {
    marginTop: 10,
    alignItems: 'flex-end'
  },
  expandedButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 5
  },
  editImage: {
    height: 27,
    width: 31
  },
  selectedTask: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical:15,
    shadowColor: '#000000',
    shadowOffset: {height:0 ,width: 2},
    shadowRadius: 5,
    shadowOpacity: 0.16,
    height: 245
  },
  buttonStyle: {
    backgroundColor: Colors.light.primary,
  },
  buttonTextStyle: {
    color: '#fff',
    textAlign:'center',
    fontSize: 12,
  },
  selectedTouchableContainer: { alignItems:'flex-start', marginTop:20},
  memberColor: {flexDirection:'row', justifyContent:'flex-end',alignItems:'flex-end', marginTop: 13}
});
