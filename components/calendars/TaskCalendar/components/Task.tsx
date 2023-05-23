import { Pressable, StyleSheet } from 'react-native';
import { Text, useThemeColor } from 'components/Themed';
import { isFixedTaskParsedType, ScheduledTaskResponseType } from 'types/tasks';
import { getTimeStringFromDateObject } from 'utils/datesAndTimes';
import React, { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  EntityTabParamList,
  RootTabParamList,
  SettingsTabParamList
} from 'types/base';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import TaskCompletionForm from 'components/forms/TaskCompletionForms/TaskCompletionForm';
import { useGetUserFullDetailsQuery } from 'reduxStore/services/api/user';
import { useUpdateTaskMutation } from 'reduxStore/services/api/tasks';
import { useCreateTaskCompletionFormMutation } from 'reduxStore/services/api/taskCompletionForms';

import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import GenericError from 'components/molecules/GenericError';
import {
  PrimaryText,
  BlackText
} from 'components/molecules/TextComponents';
import { TransparentView, WhiteView } from 'components/molecules/ViewComponents';
import Checkbox from 'components/molecules/Checkbox';
import ColourBar from 'components/molecules/ColourBar';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { createSelector } from '@reduxjs/toolkit';
import { useGetAllScheduledTasksQuery } from 'reduxStore/services/api/tasks';
import getUserFullDetails from 'hooks/useGetUserDetails';
import EntityTag from 'components/molecules/EntityTag';
import { ITEM_HEIGHT } from './shared';

export type MinimalScheduledTask = {
  id: number;
  start_datetime: Date;
  end_datetime: Date;
  title: string;
  members: number[];
  recurrence_index?: number;
  entity: number;
  resourcetype: string;
  recurrence?: any;
}

type PropTypes = {
  task: MinimalScheduledTask;
};

function Task({ task }: PropTypes) {
  const selectIsComplete = useMemo(() => {
    // Return a unique selector instance for this page so that
    // the filtered results are correctly memoized
    return createSelector(
      (allScheduledTasksResult: { data: ScheduledTaskResponseType[] }) => allScheduledTasksResult.data,
      (allScheduledTasksResult: any, task: { id: number, recurrence_index?: number }) => [task.id, task?.recurrence_index],
      (data, taskData) => data?.filter(scheduledTask => (
        (scheduledTask.id === task.id)
        && (scheduledTask.recurrence_index === task.recurrence_index)
      ))[0]?.is_complete || false
    )
  }, [])

  const { data: userDetails } = getUserFullDetails();

  const { isComplete } = useGetAllScheduledTasksQuery(
    {
      start_datetime: "2020-01-01T00:00:00Z",
      end_datetime: "2030-01-01T00:00:00Z",
    },
    {
      skip: !!userDetails?.id,
      selectFromResult: (result: any) => ({
        isComplete: selectIsComplete(result, task)
      })
    }
  )

  const navigation = useNavigation<
    | BottomTabNavigationProp<RootTabParamList>
    | StackNavigationProp<EntityTabParamList>
    | StackNavigationProp<SettingsTabParamList>
  >();
  const [showTaskForm, setShowTaskCompletionForm] = useState<boolean>(false);

  const [triggerCreateCompletionForm, createCompletionFormResult] =
    useCreateTaskCompletionFormMutation();

  const {
    data: allEntities,
    isLoading,
    error
  } = useGetAllEntitiesQuery(userDetails?.id || -1, {
    skip: !userDetails?.id
  });

  const {
    data: userFullDetails,
    isLoading: isLoadingFullDetails,
    error: fullDetailsError
  } = useGetUserFullDetailsQuery(userDetails?.id || -1);

  const [triggerUpdateTask, updateTaskResult] = useUpdateTaskMutation();

  const greyColor = useThemeColor({}, 'grey');
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

  const leftInfo = (
    <TransparentView style={styles.leftInfo}>
      <Text style={isComplete && { color: isCompleteTextColor }}>
        {getTimeStringFromDateObject(task.start_datetime)}
      </Text>
      <Text style={isComplete && { color: isCompleteTextColor }}>
        {getTimeStringFromDateObject(task.end_datetime)}
      </Text>
    </TransparentView>
  );

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
    <TransparentView style={{ borderBottomWidth: 1, paddingVertical: 5, height: ITEM_HEIGHT }}>
      <TransparentView
        style={[
          styles.containerWrapper,
        ]}
      >
        <TransparentView
          style={styles.container}
        >
          {leftInfo}
          <TransparentView style={styles.titleContainer}>
            <BlackText
              text={task.title}
              style={[
                styles.title,
                isComplete && {
                  color: isCompleteTextColor
                }
              ]}
              bold={true}
            />
            {
              ['FixedTask', 'FlexibleTask'].includes(task.resourcetype)
              && <Pressable
                onPress={() =>
                  (navigation.navigate as any)('EditTask', { taskId: task.id })
                }
              >
                <PrimaryText text={t('components.calendar.task.viewOrEdit')} />
              </Pressable>
            }
          </TransparentView>
        </TransparentView>
        {userDetails?.is_premium && <Checkbox
          disabled={isComplete}
          checked={isComplete}
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
        />}
      </TransparentView>
      <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <TransparentView style={{ flexDirection: 'row' }}>
          <EntityTag entity={entity} />
        </TransparentView>
        {memberColour}
      </TransparentView>
      {taskCompletionForm}
    </TransparentView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  title: {
    fontSize: 14,
    textAlign: 'left',
    wrap: 'nowrap'
  },
  leftInfo: {
    width: '20%',
    marginRight: 5,
  },
  containerWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  buttonTextStyle: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 12
  },
  memberColor: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 13
  }
});


export default Task
