import { StyleSheet } from 'react-native';
import { Text, useThemeColor } from 'components/Themed';
import { getTimeStringFromDateObject } from 'utils/datesAndTimes';
import React, { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootTabParamList } from 'types/base';
import { useCreateTaskCompletionFormMutation } from 'reduxStore/services/api/taskCompletionForms';
import { useUpdateTaskActionMutation } from 'reduxStore/services/api/taskActions';
import { Image } from 'components/molecules/ImageComponents';

import { PrimaryText, BlackText } from 'components/molecules/TextComponents';
import { TransparentView } from 'components/molecules/ViewComponents';
import Checkbox from 'components/molecules/Checkbox';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { ITEM_HEIGHT } from './shared';
import EntityTags from 'components/molecules/EntityTags';
import OptionTags from 'components/molecules/OptionTags';
import { useSelector } from 'react-redux';
import {
  selectIsComplete,
  selectScheduledTask
} from 'reduxStore/slices/tasks/selectors';
import dayjs from 'dayjs';
import { ScheduledTaskResponseType, ScheduledTaskType } from 'types/tasks';
import SafePressable from 'components/molecules/SafePressable';
import {
  selectCurrentUserId,
  selectUserFromId
} from 'reduxStore/slices/users/selectors';
import { selectTaskById } from 'reduxStore/slices/tasks/selectors';
import { TransparentScrollView } from 'components/molecules/ScrollViewComponents';
import { useGetMemberEntitiesQuery } from 'reduxStore/services/api/entities';
import UserInitialsWithColor from 'components/molecules/UserInitialsWithColor';

const useStyles = () => {
  const almostWhiteColor = useThemeColor({}, 'almostWhite');
  return StyleSheet.create({
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
      width: '25%',
      marginRight: 5
    },
    outerContainer: {
      borderBottomWidth: 1,
      paddingVertical: 5
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
      width: '100%'
    },
    memberColor: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      marginTop: 2
    },
    userInitials: {
      marginLeft: 2
    },
    bottomWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end'
    },
    tagsWrapper: {
      flexDirection: 'row',
      width: '50%',
      flex: 0
    },
    chatImageWrapper: {
      padding: 5,
      marginRight: 10,
      overflow: 'hidden',
      borderRadius: 5
    },
    chatImageWrapperPressed: {
      backgroundColor: almostWhiteColor
    },
    chatImage: {
      height: 18,
      width: 18
    }
  });
};

export type MinimalScheduledTask = {
  id: number;
  recurrence_index: number | null;
  action_id: number | null;
  type: ScheduledTaskType | 'ROUTINE';
};

type PropTypes = {
  task: MinimalScheduledTask;
  date: string;
};

const TimeText = ({
  scheduledTask,
  date
}: {
  scheduledTask: ScheduledTaskResponseType;
  date: string;
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  let textContent = null;
  if (scheduledTask.date && scheduledTask.duration) {
    textContent = (
      <Text>
        {`${scheduledTask.duration} ${t('common.mins')}, ${t(
          'common.anyTime'
        )}`}
      </Text>
    );
  } else if (scheduledTask.start_datetime && scheduledTask.end_datetime) {
    const startTime = new Date(scheduledTask?.start_datetime || '');
    const startDate = dayjs(startTime).format('YYYY-MM-DD');
    const endTime = new Date(scheduledTask?.end_datetime || '');
    const endDate = dayjs(endTime).format('YYYY-MM-DD');
    const multiDay = startDate !== endDate;

    const currentDate = dayjs(date).format('YYYY-MM-DD');

    const isFirstDay = multiDay && currentDate === startDate;
    const isLastDay = multiDay && currentDate === endDate;

    if (!multiDay) {
      textContent = (
        <>
          <Text>
            {`${getTimeStringFromDateObject(
              new Date(scheduledTask.start_datetime)
            )}`}
          </Text>
          <Text>
            {`${getTimeStringFromDateObject(
              new Date(scheduledTask.end_datetime)
            )}`}
          </Text>
        </>
      );
    } else {
      if (isFirstDay) {
        textContent = (
          <Text>
            {`${
              isFirstDay ? `${t('common.from')} ` : ''
            }${getTimeStringFromDateObject(
              new Date(scheduledTask.start_datetime)
            )}`}
          </Text>
        );
      } else if (isLastDay) {
        textContent = (
          <Text>
            {`${
              isLastDay ? `${t('common.until')} ` : ''
            }${getTimeStringFromDateObject(
              new Date(scheduledTask.end_datetime)
            )}`}
          </Text>
        );
      } else {
        textContent = <Text>{t('common.allDay')}</Text>;
      }
    }
  }

  return (
    <TransparentView style={styles.leftInfo}>{textContent}</TransparentView>
  );
};

function Task({ task: { id, recurrence_index, action_id }, date }: PropTypes) {
  const { isComplete, isIgnored } = useSelector(
    selectIsComplete({
      id,
      recurrenceIndex: recurrence_index,
      actionId: action_id
    })
  );
  const task = useSelector(selectTaskById(id));

  const scheduledTask = useSelector(
    selectScheduledTask({
      id,
      recurrenceIndex: recurrence_index,
      actionId: action_id
    })
  );

  const navigation = useNavigation<StackNavigationProp<RootTabParamList>>();

  const currentUserId = useSelector(selectCurrentUserId);
  const userDetails = useSelector(selectUserFromId(currentUserId || -1));
  const { data: memberEntities } = useGetMemberEntitiesQuery(null as any);
  const isCompleteTextColor = useThemeColor({}, 'mediumGrey');
  const isCompleteBoxColor = useThemeColor({}, 'primary');
  const isIgnoredBoxColor = useThemeColor({}, 'black');
  const styles = useStyles();

  const { t } = useTranslation();
  const [triggerCreateCompletionForm] = useCreateTaskCompletionFormMutation();
  const [updateTaskAction] = useUpdateTaskActionMutation();

  const hasEditPerms = useMemo(() => {
    if (userDetails && task?.members.includes(userDetails.id)) {
      return true;
    }
    if (memberEntities) {
      if (task?.entities.some((entityId) => entityId in memberEntities.byId)) {
        return true;
      }
    }
    return false;
  }, [memberEntities, userDetails, task]);

  const membersList = useMemo(() => {
    if (!task) {
      return [];
    }
    const familyMembersList = userDetails?.family?.users?.filter((item: any) =>
      task.members.includes(item.id)
    );
    const friendMembersList = userDetails?.friends?.filter((item: any) =>
      task.members.includes(item.id)
    );
    return [...(familyMembersList || []), ...(friendMembersList || [])];
  }, [userDetails, task]);

  const memberColours = useMemo(
    () => (
      <TransparentView pointerEvents="none" style={styles.memberColor}>
        {membersList?.map((user) => (
          <UserInitialsWithColor
            user={user}
            style={styles.userInitials}
            key={user.id}
          />
        )) || []}
      </TransparentView>
    ),
    [membersList, styles]
  );
  const fullContent = useMemo(() => {
    if (!scheduledTask || !task) {
      return (
        <TransparentView
          style={[styles.outerContainer, { height: ITEM_HEIGHT }]}
        />
      );
    }

    return (
      <TransparentView style={[styles.outerContainer, { height: ITEM_HEIGHT }]}>
        <TransparentView style={[styles.containerWrapper]}>
          <TransparentView style={styles.container}>
            <TimeText scheduledTask={scheduledTask} date={date} />
            <TransparentView style={styles.titleContainer}>
              <BlackText
                text={`${action_id ? 'ACTION - ' : ''}${task.title}`}
                style={[
                  styles.title,
                  isComplete && {
                    color: isCompleteTextColor
                  }
                ]}
                bold={true}
              />
              {['FixedTask', 'DueDate'].includes(task.resourcetype) &&
                hasEditPerms && (
                  <SafePressable
                    onPress={() =>
                      navigation.navigate('EditTask', {
                        taskId: task.id
                      })
                    }
                  >
                    <PrimaryText
                      text={t('components.calendar.task.viewOrEdit')}
                    />
                  </SafePressable>
                )}
            </TransparentView>
          </TransparentView>
          <SafePressable
            onPress={() => {
              (navigation.navigate as any)('Chat', {
                screen: 'MessageThread',
                initial: false,
                params: {
                  taskId: action_id ? null : task.id,
                  actionId: action_id,
                  recurrenceIndex: recurrence_index
                }
              });
            }}
            style={({ pressed }) =>
              pressed
                ? [styles.chatImageWrapper, styles.chatImageWrapperPressed]
                : [styles.chatImageWrapper]
            }
          >
            <Image
              source={require('assets/images/Chat.png')}
              style={styles.chatImage}
            />
          </SafePressable>
          {userDetails?.is_premium && hasEditPerms && (
            <Checkbox
              disabled={isComplete}
              checked={isComplete}
              color={isIgnored ? isIgnoredBoxColor : isCompleteBoxColor}
              onValueChange={async () => {
                if (action_id) {
                  await updateTaskAction({
                    id: action_id,
                    is_complete: true
                  }).unwrap();
                  return;
                }
                await triggerCreateCompletionForm({
                  resourcetype: 'TaskCompletionForm',
                  recurrence_index: scheduledTask.recurrence_index,
                  task: task.id
                }).unwrap();
              }}
            />
          )}
        </TransparentView>
        <TransparentView style={styles.bottomWrapper}>
          <TransparentScrollView style={styles.tagsWrapper} horizontal>
            <EntityTags entities={task.entities} />
            <OptionTags tagNames={task.tags} />
          </TransparentScrollView>
          {memberColours}
        </TransparentView>
      </TransparentView>
    );
  }, [
    scheduledTask,
    task,
    date,
    isComplete,
    isCompleteTextColor,
    memberColours,
    t,
    triggerCreateCompletionForm,
    userDetails?.is_premium,
    isCompleteBoxColor,
    isIgnored,
    isIgnoredBoxColor,
    action_id,
    hasEditPerms,
    navigation,
    updateTaskAction,
    recurrence_index,
    styles
  ]);

  return fullContent;
}

export default Task;
