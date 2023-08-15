import { StyleSheet } from 'react-native';
import { Text, useThemeColor } from 'components/Themed';
import { getTimeStringFromDateObject } from 'utils/datesAndTimes';
import React, { useMemo } from 'react';

import { BlackText } from 'components/molecules/TextComponents';
import { TransparentView } from 'components/molecules/ViewComponents';
import { useTranslation } from 'react-i18next';
import { ITEM_HEIGHT } from './shared';
import EntityTags from 'components/molecules/EntityTags';
import OptionTags from 'components/molecules/OptionTags';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectScheduledEntity,
  selectScheduledTask
} from 'reduxStore/slices/tasks/selectors';
import dayjs from 'dayjs';
import {
  FixedTaskResponseType,
  MinimalScheduledTask,
  ScheduledTaskResponseType,
  ScheduledTaskType,
  TaskType
} from 'types/tasks';
import SafePressable from 'components/molecules/SafePressable';
import { selectTaskById } from 'reduxStore/slices/tasks/selectors';
import { TransparentScrollView } from 'components/molecules/ScrollViewComponents';
import { PaddedSpinner } from 'components/molecules/Spinners';
import { selectEntityById } from 'reduxStore/slices/entities/selectors';
import { Feather } from '@expo/vector-icons';
import { setTaskToAction } from 'reduxStore/slices/calendars/actions';
import UserTags from 'components/molecules/UserTags';

const styles = StyleSheet.create({
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
  bottomWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  tagsWrapper: {
    flexDirection: 'row',
    width: '50%',
    flex: 0
  }
});

export type ScheduledEntity = { id: number; resourcetype: string };

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

const TaskIcon = ({ task }: { task: FixedTaskResponseType }) => {
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
  task: { id, recurrence_index, action_id, type },
  date,
  isEntity
}: PropTypes) {
  const task = useSelector(selectTaskById(id));

  const scheduledTask = useSelector(
    selectScheduledTask({
      id,
      recurrenceIndex: recurrence_index,
      actionId: action_id
    })
  );
  const scheduledEntity = useSelector(selectScheduledEntity(id, type));

  const isComplete = !!scheduledTask?.is_complete;

  const isCompleteTextColor = useThemeColor({}, 'mediumGrey');

  const dispatch = useDispatch();

  const isCompleteStyle = {
    color: isCompleteTextColor,
    textDecorationLine: 'line-through' as 'line-through'
  };

  const taskOrEntity = task || scheduledEntity;

  if ((!isEntity && !scheduledTask) || !taskOrEntity) {
    return (
      <TransparentView style={[styles.outerContainer, { height: ITEM_HEIGHT }]}>
        <PaddedSpinner />
      </TransparentView>
    );
  }

  return (
    <>
      <TransparentView style={[styles.outerContainer, { height: ITEM_HEIGHT }]}>
        <TransparentView style={[styles.containerWrapper]}>
          <TransparentView style={styles.container}>
            <TimeText
              scheduledTask={isEntity ? undefined : scheduledTask}
              date={date}
            />
            <TransparentView style={styles.titleContainer}>
              <TransparentScrollView
                contentContainerStyle={styles.iconAndTitle}
                horizontal={true}
              >
                {!isEntity && task && <TaskIcon task={task} />}
                <BlackText
                  text={
                    isEntity
                      ? scheduledEntity?.title || ''
                      : task
                      ? `${action_id ? 'ACTION - ' : ''}${task.title}`
                      : ''
                  }
                  style={[styles.title, isComplete && isCompleteStyle]}
                  bold={true}
                  numberOfLines={1}
                />
              </TransparentScrollView>
            </TransparentView>
          </TransparentView>
          {!isEntity && (
            <SafePressable
              onPress={() => {
                if (scheduledTask) {
                  dispatch(
                    setTaskToAction({
                      taskId: scheduledTask.id,
                      recurrenceIndex: scheduledTask.recurrence_index,
                      actionId: scheduledTask.action_id
                    })
                  );
                }
              }}
            >
              <Feather name="more-horizontal" size={30} />
            </SafePressable>
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
          <UserTags memberIds={taskOrEntity.members} />
        </TransparentView>
      </TransparentView>
    </>
  );
}

export default Task;
