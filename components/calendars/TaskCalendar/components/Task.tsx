import { StyleSheet } from 'react-native';
import { Text, useThemeColor } from 'components/Themed';
import { getTimeStringFromDateObject } from 'utils/datesAndTimes';
import React, { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootTabParamList } from 'types/base';
import {
  useCreateTaskActionCompletionFormMutation,
  useCreateTaskCompletionFormMutation
} from 'reduxStore/services/api/taskCompletionForms';
import { Image } from 'components/molecules/ImageComponents';

import { PrimaryText, BlackText } from 'components/molecules/TextComponents';
import { TransparentView, WhiteBox } from 'components/molecules/ViewComponents';
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
import {
  ScheduledTaskResponseType,
  ScheduledTaskType,
  TaskType
} from 'types/tasks';
import SafePressable from 'components/molecules/SafePressable';
import {
  selectCurrentUserId,
  selectUserFromId
} from 'reduxStore/slices/users/selectors';
import { selectTaskById } from 'reduxStore/slices/tasks/selectors';
import { TransparentScrollView } from 'components/molecules/ScrollViewComponents';
import { useGetMemberEntitiesQuery } from 'reduxStore/services/api/entities';
import UserInitialsWithColor from 'components/molecules/UserInitialsWithColor';
import TaskCompletionForm, {
  FORM_REQUIRED_TAGS
} from 'components/forms/TaskCompletionForms/TaskCompletionForm';
import { PaddedSpinner } from 'components/molecules/Spinners';
import OutsidePressHandler from 'react-native-outside-press';
import { LinkButton } from 'components/molecules/ButtonComponents';
import { YesNoModal } from 'components/molecules/Modals';
import { useCreateRecurrentTaskOverwriteMutation } from 'reduxStore/services/api/tasks';
import { selectEntityById } from 'reduxStore/slices/entities/selectors';

const useStyles = () => {
  const almostWhiteColor = useThemeColor({}, 'almostWhite');
  return StyleSheet.create({
    titleContainer: {
      flex: 1
    },
    titleContentContainer: {
      flex: 1,
      justifyContent: 'flex-start'
    },
    iconAndTitle: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-start'
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
    },
    editRecurrenceModal: {
      position: 'absolute',
      left: 5,
      top: 5
    },
    editRecurrenceModalBox: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      maxWidth: '100%',
      alignItems: 'center'
    },
    editRecurrenceModalLink: {
      marginRight: 10
    },
    numExternalMembers: { marginLeft: 5 }
  });
};

export type MinimalScheduledTask = {
  id: number;
  recurrence_index: number | null;
  action_id: number | null;
  type: ScheduledTaskType | 'ROUTINE' | 'ENTITY';
};

type PropTypes = {
  task: MinimalScheduledTask;
  date: string;
  isEntity?: boolean;
};

const TimeText = ({
  scheduledTask,
  date,
  type
}: {
  scheduledTask?: ScheduledTaskResponseType;
  date: string;
  type?: TaskType;
}) => {
  /*
    If scheduledTask is undefined then this is an entity
  */
  const { t } = useTranslation();
  const styles = useStyles();

  let textContent = null;
  if (!scheduledTask) {
    textContent = <Text>{t('common.allDay')}</Text>;
  } else if (type && ['BIRTHDAY', 'ANNIVERSARY'].includes(type)) {
    textContent = <Text>{t('common.allDay')}</Text>;
  } else if (scheduledTask.start_date && scheduledTask.end_date) {
    textContent = <Text>{t('common.allDay')}</Text>;
  } else if (scheduledTask.date && scheduledTask.duration) {
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

const TaskIcon = ({
  scheduledTask
}: {
  scheduledTask: ScheduledTaskResponseType;
}) => {
  const task = useSelector(selectTaskById(scheduledTask.id));

  const iconMappings: {
    [key in TaskType]?: string;
  } = {
    FLIGHT: '✈️',
    TRAIN: '🚟',
    RENTAL_CAR: '🚙',
    TAXI: '🚖',
    DRIVE_TIME: '🚗',
    HOTEL: '🏨',
    STAY_WITH_FRIEND: '🏠',
    ACTIVITY: '🎯',
    OTHER_ACTIVITY: '🎯',
    FOOD_ACTIVITY: '🍲',
    BIRTHDAY: '🎂',
    ANNIVERSARY: '🍾'
  };

  const icon = (task?.type && iconMappings[task.type]) || '';

  return icon ? (
    <TransparentView>
      <Text>{`${icon} `}</Text>
    </TransparentView>
  ) : null;
};

function Task({
  task: { id, recurrence_index, action_id },
  date,
  isEntity
}: PropTypes) {
  const { isComplete, isIgnored } = useSelector(
    selectIsComplete({
      id,
      recurrenceIndex: recurrence_index,
      actionId: action_id
    })
  );
  const task = useSelector(selectTaskById(id));
  const entity = useSelector(selectEntityById(id));

  const scheduledTask = useSelector(
    selectScheduledTask({
      id,
      recurrenceIndex: recurrence_index,
      actionId: action_id
    })
  );

  const [showTaskCompletionForm, setShowTaskCompletionForm] = useState(false);
  const [deletingOccurrence, setDeletingOccurrence] = useState(false);
  const [showUpdateRecurrenceModal, setShowUpdateRecurrenceModal] =
    useState(false);

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
  const [createTaskActionCompletionForm] =
    useCreateTaskActionCompletionFormMutation();

  const [createRecurrentTaskOverwrite] =
    useCreateRecurrentTaskOverwriteMutation();

  const hasEditPerms = useMemo(() => {
    if (userDetails && (task || entity)?.members.includes(userDetails.id)) {
      return true;
    }
    if (memberEntities && !isEntity) {
      if (task?.entities.some((entityId) => entityId in memberEntities.byId)) {
        return true;
      }
    }
    return false;
  }, [memberEntities, userDetails, task, entity, isEntity]);

  const [membersList, numExternalMembers] = useMemo(() => {
    const taskOrEntity = isEntity ? entity : task;
    if (!taskOrEntity) {
      return [];
    }
    const familyMembersList = userDetails?.family?.users?.filter((item: any) =>
      taskOrEntity.members.includes(item.id)
    );
    const friendMembersList = userDetails?.friends?.filter((item: any) =>
      taskOrEntity.members.includes(item.id)
    );
    const members = Array(
      ...new Set([...(familyMembersList || []), ...(friendMembersList || [])])
    );
    return [members, taskOrEntity.members.length - members.length];
  }, [userDetails, task, entity, isEntity]);

  const editRecurrenceModal = useMemo(() => {
    if (!(task && recurrence_index !== null)) {
      return null;
    }
    return (
      <OutsidePressHandler
        onOutsidePress={() => setShowUpdateRecurrenceModal(false)}
        disabled={false}
        style={styles.editRecurrenceModal}
      >
        <WhiteBox style={styles.editRecurrenceModalBox}>
          <LinkButton
            onPress={() => {
              navigation.navigate('EditTaskOccurrence', {
                taskId: task.id,
                recurrenceIndex: recurrence_index
              });
            }}
            title={t('components.task.editOccurrence')}
            style={styles.editRecurrenceModalLink}
          />
          <LinkButton
            onPress={() => {
              setDeletingOccurrence(true);
            }}
            title={t('components.task.deleteOccurrence')}
            style={styles.editRecurrenceModalLink}
          />
          <LinkButton
            onPress={() => {
              navigation.navigate('EditTask', {
                taskId: task.id
              });
            }}
            title={t('components.task.editAll')}
            style={styles.editRecurrenceModalLink}
          />
          <SafePressable onPress={() => setShowUpdateRecurrenceModal(false)}>
            <PrimaryText text={t('common.cancel')} bold={true} />
          </SafePressable>
        </WhiteBox>
      </OutsidePressHandler>
    );
  }, [t, styles, navigation, task, recurrence_index]);

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
        {numExternalMembers ? (
          <BlackText
            text={`+${numExternalMembers}`}
            style={styles.numExternalMembers}
          />
        ) : null}
      </TransparentView>
    ),
    [membersList, styles, numExternalMembers]
  );
  const fullContent = useMemo(() => {
    if ((!scheduledTask || !task) && !entity) {
      return (
        <TransparentView
          style={[styles.outerContainer, { height: ITEM_HEIGHT }]}
        >
          <PaddedSpinner />
        </TransparentView>
      );
    }

    const showCheckbox =
      userDetails?.is_premium &&
      hasEditPerms &&
      scheduledTask &&
      task &&
      ['TASK', 'APPOINTMENT', 'DUE_DATE'].includes(task.type) &&
      !isEntity;

    return (
      <>
        <TransparentView
          style={[styles.outerContainer, { height: ITEM_HEIGHT }]}
        >
          <TransparentView style={[styles.containerWrapper]}>
            <TransparentView style={styles.container}>
              <TimeText
                scheduledTask={isEntity ? undefined : scheduledTask}
                date={date}
                type={task?.type}
              />
              <TransparentView style={styles.titleContainer}>
                <TransparentScrollView
                  contentContainerStyle={styles.iconAndTitle}
                  horizontal={true}
                >
                  {!isEntity && scheduledTask && (
                    <TaskIcon scheduledTask={scheduledTask} />
                  )}
                  <BlackText
                    text={
                      isEntity
                        ? entity?.name || ''
                        : task
                        ? `${action_id ? 'ACTION - ' : ''}${task.title}`
                        : ''
                    }
                    style={[
                      styles.title,
                      isComplete && {
                        color: isCompleteTextColor
                      }
                    ]}
                    bold={true}
                    numberOfLines={1}
                  />
                </TransparentScrollView>
                {!isEntity &&
                  task &&
                  [
                    'FixedTask',
                    'TransportTask',
                    'AccommodationTask',
                    'BirthdayTask',
                    'AnniversaryTask'
                  ].includes(task.resourcetype) &&
                  hasEditPerms && (
                    <SafePressable
                      onPress={() => {
                        if (task.recurrence) {
                          setShowUpdateRecurrenceModal(true);
                        } else {
                          navigation.navigate('EditTask', {
                            taskId: task.id
                          });
                        }
                      }}
                    >
                      <PrimaryText
                        text={t('components.calendar.task.viewOrEdit')}
                      />
                    </SafePressable>
                  )}
              </TransparentView>
            </TransparentView>
            {!isEntity && task && (
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
            )}
            {showCheckbox && (
              <Checkbox
                disabled={isComplete}
                checked={isComplete}
                color={isIgnored ? isIgnoredBoxColor : isCompleteBoxColor}
                onValueChange={async () => {
                  if (action_id) {
                    await createTaskActionCompletionForm({
                      action: action_id,
                      recurrence_index: scheduledTask.recurrence_index
                    }).unwrap();
                    return;
                  }
                  await triggerCreateCompletionForm({
                    resourcetype: 'TaskCompletionForm',
                    recurrence_index: scheduledTask.recurrence_index,
                    task: task.id
                  }).unwrap();

                  if (FORM_REQUIRED_TAGS.includes(task.hidden_tag)) {
                    setShowTaskCompletionForm(true);
                  }
                }}
              />
            )}
          </TransparentView>
          <TransparentView style={styles.bottomWrapper}>
            <TransparentScrollView style={styles.tagsWrapper} horizontal>
              {!isEntity && task && (
                <>
                  <EntityTags entities={task.entities} />
                  <OptionTags tagNames={task.tags} />
                </>
              )}
            </TransparentScrollView>
            {memberColours}
          </TransparentView>
          {!isEntity && task && (
            <TaskCompletionForm
              taskId={id}
              title={t('components.task.scheduleNext', {
                dueDateType: task.hidden_tag
                  ? t(`hiddenTags.${task.hidden_tag}`)
                  : ''
              })}
              onSubmitSuccess={() => {
                setShowTaskCompletionForm(false);
              }}
              onRequestClose={() => {
                setShowTaskCompletionForm(false);
              }}
              visible={showTaskCompletionForm}
            />
          )}
        </TransparentView>
        <YesNoModal
          title={t('components.task.deleteOccurrence')}
          question={t('components.task.deleteOccurrenceConfirmation')}
          visible={deletingOccurrence}
          onYes={() => {
            if (task?.recurrence?.id && recurrence_index !== null) {
              createRecurrentTaskOverwrite({
                task: null,
                recurrence_index,
                recurrence: task.recurrence.id,
                baseTaskId: task.id
              });
            }
          }}
          onNo={() => {
            setDeletingOccurrence(false);
          }}
        />
        {showUpdateRecurrenceModal && editRecurrenceModal}
      </>
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
    recurrence_index,
    styles,
    id,
    showTaskCompletionForm,
    createTaskActionCompletionForm,
    showUpdateRecurrenceModal,
    editRecurrenceModal,
    deletingOccurrence,
    createRecurrentTaskOverwrite,
    entity,
    isEntity
  ]);

  return fullContent;
}

export default Task;
