import { Pressable, StyleSheet } from 'react-native';
import { Text, useThemeColor } from 'components/Themed';
import { getTimeStringFromDateObject } from 'utils/datesAndTimes';
import React, { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  ContentTabParamList,
  RootTabParamList,
  SettingsTabParamList
} from 'types/base';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useCreateTaskCompletionFormMutation } from 'reduxStore/services/api/taskCompletionForms';

import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { PrimaryText, BlackText } from 'components/molecules/TextComponents';
import { TransparentView } from 'components/molecules/ViewComponents';
import Checkbox from 'components/molecules/Checkbox';
import ColourBar from 'components/molecules/ColourBar';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import getUserFullDetails from 'hooks/useGetUserDetails';
import { ITEM_HEIGHT } from './shared';
import EntityTags from 'components/molecules/EntityTags';
import { useSelector } from 'react-redux';
import {
  selectIsComplete,
  selectScheduledTask,
  selectTask
} from 'reduxStore/slices/calendars/selectors';
import dayjs from 'dayjs';
import { ScheduledTaskResponseType } from 'types/tasks';

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
    marginTop: 13
  },
  bottomWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  tagsWrapper: { flexDirection: 'row', width: '50%', flex: 0 }
});

export type MinimalScheduledTask = {
  id: number;
  recurrence_index: number | null;
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

function Task({ task: { id, recurrence_index }, date }: PropTypes) {
  const { data: userDetails } = getUserFullDetails();

  const isComplete = useSelector(
    selectIsComplete({ id, recurrenceIndex: recurrence_index })
  );
  const task = useSelector(selectTask(id));
  const scheduledTask = useSelector(
    selectScheduledTask({ id, recurrenceIndex: recurrence_index })
  );

  const navigation = useNavigation<
    | BottomTabNavigationProp<RootTabParamList>
    | StackNavigationProp<ContentTabParamList>
    | StackNavigationProp<SettingsTabParamList>
  >();

  const [triggerCreateCompletionForm, createCompletionFormResult] =
    useCreateTaskCompletionFormMutation();

  const {
    data: allEntities,
    isLoading,
    error
  } = useGetAllEntitiesQuery(null as any, {
    skip: !userDetails?.id
  });

  const isCompleteTextColor = useThemeColor({}, 'mediumGrey');

  const { t } = useTranslation();

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

  const entities = useMemo(() => {
    if (!allEntities || !task) {
      return [];
    }
    return task.entities
      .map((entityId) => allEntities.byId[entityId])
      .filter((ent) => !!ent);
  }, [task, allEntities]);

  const memberColour = useMemo(
    () => (
      <TransparentView pointerEvents="none" style={styles.memberColor}>
        <ColourBar
          colourHexcodes={
            membersList?.map(({ member_colour }) => member_colour) || []
          }
        />
      </TransparentView>
    ),
    [membersList]
  );

  const fullContent = useMemo(() => {
    if (isLoading || !allEntities) {
      return null;
    }
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
                text={task.title}
                style={[
                  styles.title,
                  isComplete && {
                    color: isCompleteTextColor
                  }
                ]}
                bold={true}
              />
              {['FixedTask', 'DueDate'].includes(task.resourcetype) && (
                <Pressable
                  onPress={() =>
                    (navigation.navigate as any)('EditTask', {
                      taskId: task.id
                    })
                  }
                >
                  <PrimaryText
                    text={t('components.calendar.task.viewOrEdit')}
                  />
                </Pressable>
              )}
            </TransparentView>
          </TransparentView>
          {userDetails?.is_premium && (
            <Checkbox
              disabled={isComplete}
              checked={isComplete}
              color={isCompleteTextColor}
              onValueChange={async () => {
                await triggerCreateCompletionForm({
                  resourcetype: `TaskCompletionForm`,
                  recurrence_index: scheduledTask.recurrence_index,
                  task: task.id
                });
              }}
            />
          )}
        </TransparentView>
        <TransparentView style={styles.bottomWrapper}>
          <TransparentView style={styles.tagsWrapper}>
            <EntityTags entities={entities} />
          </TransparentView>
          {memberColour}
        </TransparentView>
      </TransparentView>
    );
  }, [
    scheduledTask,
    task,
    date,
    isComplete,
    allEntities,
    entities,
    isCompleteTextColor,
    isLoading,
    memberColour,
    navigation.navigate,
    t,
    triggerCreateCompletionForm,
    userDetails?.is_premium
  ]);

  return fullContent;
}

export default Task;
