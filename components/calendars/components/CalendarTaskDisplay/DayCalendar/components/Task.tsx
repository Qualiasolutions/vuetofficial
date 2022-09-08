import { Image, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useThemeColor, View } from 'components/Themed';
import { isFixedTaskParsedType, ScheduledTaskParsedType } from 'types/tasks';
import { getTimeStringFromDateObject } from 'utils/datesAndTimes';
import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import {
  selectAccessToken,
  selectUsername
} from 'reduxStore/slices/auth/selectors';
import SquareButton from 'components/molecules/SquareButton';
import { useNavigation } from '@react-navigation/native';
import {
  EntityTabParamList,
  RootTabParamList,
  SettingsTabParamList
} from 'types/base';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import TaskCompletionForm from 'components/forms/TaskCompletionForms/TaskCompletionForm';
import {
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery
} from 'reduxStore/services/api/user';
import { useUpdateTaskMutation } from 'reduxStore/services/api/tasks';
import { useCreateTaskCompletionFormMutation } from 'reduxStore/services/api/taskCompletionForms';

import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import GenericError from 'components/molecules/GenericError';
import { WhiteText, PrimaryText } from 'components/molecules/TextComponents';
import Layout from 'constants/Layout';
import { Feather } from '@expo/vector-icons';
import {
  TransparentView,
  WhiteView
} from 'components/molecules/ViewComponents';
import Checkbox from 'components/molecules/Checkbox';
import ColourBar from 'components/molecules/ColourBar';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

type PropTypes = {
  task: ScheduledTaskParsedType;
  selected: boolean;
  onPress: (event: ScheduledTaskParsedType) => void;
  onHeaderPress: (event: ScheduledTaskParsedType) => void;
};

export default function Task({
  task,
  selected,
  onPress,
  onHeaderPress
}: PropTypes) {
  const jwtAccessToken = useSelector(selectAccessToken);
  const username = useSelector(selectUsername);

  const navigation = useNavigation<
    | BottomTabNavigationProp<RootTabParamList>
    | StackNavigationProp<EntityTabParamList>
    | StackNavigationProp<SettingsTabParamList>
  >();
  const [showTaskForm, setShowTaskCompletionForm] = useState<boolean>(false);

  const { data: userDetails } = useGetUserDetailsQuery(username);

  const [triggerCreateCompletionForm, createCompletionFormResult] =
    useCreateTaskCompletionFormMutation();

  const {
    data: allEntities,
    isLoading,
    error
  } = useGetAllEntitiesQuery(userDetails?.user_id || -1, {
    skip: !userDetails?.user_id
  });

  const {
    data: userFullDetails,
    isLoading: isLoadingFullDetails,
    error: fullDetailsError
  } = useGetUserFullDetailsQuery(userDetails?.user_id || -1);

  const [triggerUpdateTask, updateTaskResult] = useUpdateTaskMutation();

  const primaryColor = useThemeColor({}, 'primary');
  const greyColor = useThemeColor({}, 'grey');

  const { t } = useTranslation();

  if (isLoading || !allEntities) {
    return null;
  }

  if (error) {
    return <GenericError />;
  }

  const familyMembersList = userFullDetails?.family?.users?.filter(
    (item: any) => task.members.includes(item.id)
  );
  const friendMembersList = userFullDetails?.friends?.filter((item: any) =>
    task.members.includes(item.id)
  );

  const membersList = [
    ...(familyMembersList || []),
    ...(friendMembersList || [])
  ];

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
      <Pressable
        onPress={() => onHeaderPress(task)}
        style={[styles.expandedHeader, { backgroundColor: primaryColor }]}
      >
        <WhiteText text={entity?.name} style={styles.expandedTitle} />
        <Pressable
          onPress={() =>
            (navigation.navigate as any)('EntityNavigator', {
              screen: 'EditEntity',
              initial: false,
              params: { entityId: entity.id }
            })
          }
          style={[styles.expandedHeader, { backgroundColor: primaryColor }]}
        >
          <Image
            source={require('assets/images/edit.png')}
            style={styles.editImage}
          />
        </Pressable>
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
          buttonStyle={{ backgroundColor: primaryColor }}
          buttonTextStyle={styles.buttonTextStyle}
          buttonSize={35}
        />
        <SquareButton
          buttonText={'+1\nWeek'}
          onPress={() => {
            addDays(7);
          }}
          buttonStyle={{ backgroundColor: primaryColor }}
          buttonTextStyle={styles.buttonTextStyle}
          buttonSize={35}
        />
        <SquareButton
          customIcon={<Feather name="calendar" color={'#fff'} size={25} />}
          onPress={() =>
            (navigation.navigate as any)('EditTask', { taskId: task.id })
          }
          buttonStyle={{ backgroundColor: primaryColor }}
        />
      </View>
    </View>
  ) : null;

  const memberColour = (
    <TransparentView pointerEvents="none" style={styles.memberColor}>
      <ColourBar
        colourHexcodes={
          membersList?.map(({ member_colour }) => member_colour) || []
        }
      />
    </TransparentView>
  );

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
    <WhiteView
      style={[
        styles.container,
        entity &&
          selected && {
            ...styles.selectedTask,
            borderColor: greyColor
          }
      ]}
    >
      {expandedHeader}
      <View
        style={[
          styles.touchableContainerWrapper,
          selected && styles.selectedTouchableContainer
        ]}
      >
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
          disabled={task.is_complete}
          style={styles.checkbox}
          checked={task.is_complete}
          onValueChange={async () => {
            if (taskTypesRequiringForm.includes(task.resourcetype)) {
              return setShowTaskCompletionForm(true);
            }
            await triggerCreateCompletionForm({
              resourcetype: `${task.resourcetype}CompletionForm`,
              recurrence_index: task.recurrence_index,
              task: task.id
            });
          }}
        />
      </View>
      {selected ? (
        <Pressable
          onPress={() =>
            (navigation.navigate as any)('EditTask', { taskId: task.id })
          }
          style={styles.viewEditContainer}
        >
          <PrimaryText text={t('components.calendar.task.viewOrEdit')} />
        </Pressable>
      ) : null}
      {taskCompletionForm}
      {expandedOptions}
      {memberColour}
      {!selected && <View style={styles.separator}></View>}
    </WhiteView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Layout.window.width - 100,
    marginTop: 10
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
    marginRight: 30,
    marginLeft: 13
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
  viewEditContainer: {
    marginTop: 0,
    paddingTop: 0,
    marginLeft: 30
  },
  checkbox: {
    margin: 10
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
    height: 53
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
    justifyContent: 'flex-end',
    paddingRight: 5
  },
  editImage: {
    height: 27,
    width: 31
  },
  selectedTask: {
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 15,
    shadowColor: '#000000',
    shadowOffset: { height: 0, width: 2 },
    shadowRadius: 5,
    shadowOpacity: 0.16,
    height: 245,
    elevation: 5,
    borderWidth: 1
  },
  buttonTextStyle: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 12
  },
  selectedTouchableContainer: { alignItems: 'flex-start', marginTop: 20 },
  memberColor: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 13
  }
});
