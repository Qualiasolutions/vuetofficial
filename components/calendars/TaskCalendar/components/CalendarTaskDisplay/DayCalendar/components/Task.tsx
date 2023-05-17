import { Pressable, StyleSheet } from 'react-native';
import { Text, useThemeColor, View } from 'components/Themed';
import { isFixedTaskParsedType, ScheduledTaskParsedType } from 'types/tasks';
import { getTimeStringFromDateObject } from 'utils/datesAndTimes';
import { useSelector } from 'react-redux';
import React, { useMemo, useState } from 'react';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
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
import {
  WhiteText,
  PrimaryText,
  BlackText
} from 'components/molecules/TextComponents';
import { Feather } from '@expo/vector-icons';
import {
  TransparentView,
  WhiteView
} from 'components/molecules/ViewComponents';
import Checkbox from 'components/molecules/Checkbox';
import ColourBar from 'components/molecules/ColourBar';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { Image } from 'components/molecules/ImageComponents';
import { TouchableOpacity } from 'components/molecules/TouchableOpacityComponents';
import {
  selectSelectedRecurrenceIndex,
  selectSelectedTaskId
} from 'reduxStore/slices/calendars/selectors';

type PropTypes = {
  task: ScheduledTaskParsedType;
  onPress: (event: ScheduledTaskParsedType) => void;
  onHeaderPress: (event: ScheduledTaskParsedType) => void;
};

function Task({ task, onPress, onHeaderPress }: PropTypes) {
  const username = useSelector(selectUsername);
  const selectedTaskId = useSelector(selectSelectedTaskId);
  const selectedRecurrenceIndex = useSelector(selectSelectedRecurrenceIndex);
  const selected =
    !task.is_complete &&
    ((task.id === selectedTaskId && task.recurrence_index === undefined) ||
      task.recurrence_index === selectedRecurrenceIndex);

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
  const isCompleteBackgroundColor = useThemeColor({}, 'grey');
  const isCompleteTextColor = useThemeColor({}, 'mediumGrey');

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
    <TransparentView style={styles.leftInfo}>
      <Text style={task.is_complete && { color: isCompleteTextColor }}>
        {getTimeStringFromDateObject(task.start_datetime)}
      </Text>
      <Text style={task.is_complete && { color: isCompleteTextColor }}>
        {getTimeStringFromDateObject(task.end_datetime)}
      </Text>
    </TransparentView>
  );

  const expandedHeader =
    entity && selected ? (
      <Pressable
        onPress={() => onHeaderPress(task)}
        style={[styles.expandedHeader, { backgroundColor: primaryColor }]}
      >
        <WhiteText
          text={entity?.name}
          style={styles.expandedTitle}
          bold={true}
        />
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

  const expandedOptions =
    selected && ['FixedTask', 'FlexibleTask'].includes(task.resourcetype) ? (
      <TransparentView style={styles.expandedOptions}>
        <TransparentView style={styles.expandedButtons}>
          {task.resourcetype === 'FixedTask' && !task.recurrence ? (
            <>
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
            </>
          ) : null}
          <SquareButton
            customIcon={<Feather name="calendar" color={'#fff'} size={25} />}
            onPress={() =>
              (navigation.navigate as any)('EditTask', { taskId: task.id })
            }
            buttonStyle={{ backgroundColor: primaryColor }}
          />
        </TransparentView>
      </TransparentView>
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
        onRequestClose={() => setShowTaskCompletionForm(false)}
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
        },
        task.is_complete && {
          backgroundColor: isCompleteBackgroundColor
        }
      ]}
    >
      {expandedHeader}
      <TransparentView
        style={[
          styles.touchableContainerWrapper,
          selected && styles.selectedTouchableContainer
        ]}
      >
        <TouchableOpacity
          style={styles.touchableContainer}
          onPress={() => {
            if (!task.is_complete) {
              onPress(task);
            }
          }}
        >
          {leftInfo}
          <TransparentView style={styles.titleContainer}>
            <BlackText
              text={task.title}
              style={[
                styles.title,
                task.is_complete && {
                  color: isCompleteTextColor
                }
              ]}
              bold={true}
            />
          </TransparentView>
        </TouchableOpacity>
        <Checkbox
          disabled={task.is_complete}
          style={styles.checkbox}
          checked={task.is_complete}
          smoothChecking={!taskTypesRequiringForm.includes(task.resourcetype)}
          color={isCompleteTextColor}
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
      </TransparentView>
      {selected && ['FixedTask', 'FlexibleTask'].includes(task.resourcetype) ? (
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
    marginTop: 10,
    paddingTop: 10,
    borderRadius: 10,
    overflow: 'hidden'
  },
  titleContainer: {
    width: '40%'
  },
  title: {
    fontSize: 14,
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
    marginTop: 10,
    paddingTop: 0,
    marginLeft: 30
  },
  checkbox: {
    margin: 10
  },
  separator: {
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
    paddingTop: 0,
    marginTop: 10,
    overflow: 'hidden',
    marginVertical: 15,
    shadowColor: '#000000',
    shadowOffset: { height: 0, width: 2 },
    shadowRadius: 5,
    shadowOpacity: 0.16,
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


export default Task
