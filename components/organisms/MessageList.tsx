import { useIsFocused, useNavigation } from '@react-navigation/native';
import { FullPageSpinner } from 'components/molecules/Spinners';
import {
  TransparentContainerView,
  TransparentView
} from 'components/molecules/ViewComponents';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';

import { Text, useThemeColor } from 'components/Themed';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useGetMessageThreadsQuery } from 'reduxStore/services/api/messages';
import { selectEntityById } from 'reduxStore/slices/entities/selectors';
import { MessagesTabParamList } from 'types/base';
import { MessageResponse } from 'types/messages';
import { parseSummaryTime } from 'utils/datesAndTimes';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import SafePressable from 'components/molecules/SafePressable';
import {
  selectScheduledTask,
  selectTaskById
} from 'reduxStore/slices/tasks/selectors';

const useListingStyles = () => {
  const greyColor = useThemeColor({}, 'mediumLightGrey');

  return StyleSheet.create({
    container: {
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderColor: greyColor,
      width: '100%'
    },
    titleText: {
      fontWeight: 'bold'
    },
    topInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      alignItems: 'center'
    },
    summaryTime: { color: greyColor },
    lastMessage: { color: greyColor, marginTop: 5 },
    pressedStyle: {
      borderWidth: 2,
      borderBottomWidth: 2
    }
  });
};

const MessageThreadListing = ({ thread }: { thread: MessageResponse }) => {
  const entity = useSelector(selectEntityById(thread.entity || -1));
  const task = useSelector(selectTaskById(thread.task || -1));
  const listingStyles = useListingStyles();

  const scheduledTask = useSelector(
    selectScheduledTask({
      id: thread.task,
      actionId: thread.action,
      recurrenceIndex: thread.recurrence_index
    })
  );

  const navigation =
    useNavigation<BottomTabNavigationProp<MessagesTabParamList>>();

  let title = '';
  if (entity) {
    title = entity.name;
  }
  if (task) {
    // This only applies when there is a task but no scheduled task
    // - could be an edge case when we pull less scheduled tasks
    // and so don't have the scheduled task to get the title from
    title = task.title;
  }
  if (scheduledTask) {
    title = scheduledTask.title;

    if (scheduledTask.date) {
      const [year, month, day] = scheduledTask.date.split('-');
      title += ` (${day}/${month}/${year})`;
    }
    if (scheduledTask.start_datetime) {
      const [year, month, day] = scheduledTask.start_datetime
        .split('T')[0]
        .split('-');
      title += ` (${day}/${month}/${year})`;
    }
  }

  return (
    <SafePressable
      style={({ pressed }) => [
        listingStyles.container,
        pressed ? listingStyles.pressedStyle : {}
      ]}
      onPress={() =>
        navigation.navigate('MessageThread', {
          taskId: thread.task,
          entityId: thread.entity,
          actionId: thread.action,
          recurrenceIndex: thread.recurrence_index
        })
      }
    >
      <TransparentView style={listingStyles.topInfo}>
        <Text style={listingStyles.titleText} bold={true}>
          {title}
        </Text>
        <Text style={listingStyles.summaryTime}>
          {parseSummaryTime(thread.created_at)}
        </Text>
      </TransparentView>
      <Text style={listingStyles.lastMessage}>
        {thread.name}: {thread.text}
      </Text>
    </SafePressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    marginTop: 50
  }
});
export default function MessageList() {
  const isFocused = useIsFocused();

  const { data: messageThreads, isLoading } = useGetMessageThreadsQuery(
    null as any,
    { pollingInterval: 10000, skip: !isFocused }
  );

  if (isLoading || !messageThreads) {
    return <FullPageSpinner />;
  }

  return (
    <TransparentFullPageScrollView contentContainerStyle={styles.container}>
      {messageThreads.map((thread, i) => (
        <MessageThreadListing key={i} thread={thread} />
      ))}
    </TransparentFullPageScrollView>
  );
}
