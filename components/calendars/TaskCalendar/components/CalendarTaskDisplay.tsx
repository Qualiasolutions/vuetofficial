import { StyleSheet, SectionList } from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
  getDateStringFromDateObject,
  getDateStringsBetween,
  getDateWithoutTimezone,
} from 'utils/datesAndTimes';

import { ParsedPeriod, ParsedReminder, PeriodResponse, ScheduledReminder } from 'types/periods';
import { Text } from 'components/Themed';
import dayjs from 'dayjs';
import {
  AlmostWhiteView,
  TransparentPaddedView,
  TransparentView
} from 'components/molecules/ViewComponents';
import { LinkButton } from 'components/molecules/ButtonComponents';
import { PaddedSpinner } from 'components/molecules/Spinners';
import { t } from 'i18next';
import { useSelector } from 'react-redux';
import { selectMonthEnforcedDate } from 'reduxStore/slices/calendars/selectors';
import Task, { MinimalScheduledTask } from './Task';
import OneDayPeriod from './OneDayPeriod';
import Reminder from './Reminder';

type SingleDateTasks = {
  tasks: MinimalScheduledTask[];
  periods: ParsedPeriod[];
  reminders: ParsedReminder[];
};

type AllDateTasks = {
  [key: string]: SingleDateTasks;
};

const parseReminder = (res: ScheduledReminder): ParsedReminder => {
  const parsedReminder = {
    ...res,
    end_date: getDateWithoutTimezone(res.end_date),
    start_date: getDateWithoutTimezone(res.start_date)
  };
  delete parsedReminder?.is_complete

  return parsedReminder
};

type ItemType = "TASK" | "PERIOD" | "REMINDER"
type ItemData = (ParsedPeriod | ParsedReminder | MinimalScheduledTask) & { type: ItemType }
const isTask = (item: ItemData): item is MinimalScheduledTask & { type: "TASK" } => {
  return item.type === "TASK"
}
const isPeriod = (item: ItemData): item is ParsedPeriod & { type: "PERIOD" } => {
  return item.type === "PERIOD"
}
const isReminder = (item: ItemData): item is ParsedReminder & { type: "REMINDER" } => {
  return item.type === "REMINDER"
}
const ListItem = React.memo(({ data }: { data: ItemData }) => {
  if (isTask(data)) {
    return <Task task={data} />
  }
  if (isPeriod(data)) {
    return <OneDayPeriod period={data} />
  }
  if (isReminder(data)) {
    return <Reminder reminder={data} />
  }
  return null
})

function Calendar({
  tasks,
  periods,
  reminders,
  onChangeFirstDate,
  alwaysIncludeCurrentDate = false
}: {
  tasks: MinimalScheduledTask[];
  periods: ParsedPeriod[];
  reminders: ParsedReminder[];
  alwaysIncludeCurrentDate?: boolean;
  onChangeFirstDate?: (date: string) => void;
}) {
  const [tasksPerDate, setTasksPerDate] = React.useState<AllDateTasks>({});
  const [futureMonthsToShow, setFutureMonthsToShow] = useState(3);
  const [pastMonthsToShow, setPastMonthsToShow] = useState(0);
  const [rerenderingList, setRerenderingList] = useState(false);
  const monthEnforcedDate = useSelector(selectMonthEnforcedDate)
  const sectionListRef = useRef<any>(null)

  const updateDate = (newDate: string) => {
    if (onChangeFirstDate && newDate) {
      onChangeFirstDate(newDate)
    }
  }


  const formatAndSetTasksPerDate = (): void => {
    const newTasksPerDate: AllDateTasks = {};
    for (const task of tasks) {
      const taskDates = getDateStringsBetween(
        task.start_datetime,
        task.end_datetime
      );

      for (const taskDate of taskDates) {
        if (newTasksPerDate[taskDate]) {
          newTasksPerDate[taskDate].tasks.push(task);
        } else {
          newTasksPerDate[taskDate] = {
            tasks: [task],
            periods: [],
            reminders: []
          };
        }
      }
    }

    for (const parsedPeriod of periods) {
      const periodDates = getDateStringsBetween(
        parsedPeriod.start_date,
        parsedPeriod.end_date,
        true // Use UTC
      );

      for (const periodDate of periodDates) {
        if (newTasksPerDate[periodDate]) {
          newTasksPerDate[periodDate].periods.push(parsedPeriod);
        } else {
          newTasksPerDate[periodDate] = {
            tasks: [],
            periods: [parsedPeriod],
            reminders: []
          };
        }
      }
    }

    for (const parsedReminder of reminders) {
      const reminderDates = getDateStringsBetween(
        parsedReminder.start_date,
        parsedReminder.end_date,
        true // Use UTC
      );

      for (const reminderDate of reminderDates) {
        if (newTasksPerDate[reminderDate]) {
          newTasksPerDate[reminderDate].reminders.push(parsedReminder);
        } else {
          newTasksPerDate[reminderDate] = {
            tasks: [],
            periods: [],
            reminders: [parsedReminder]
          };
        }
      }
    }

    if (alwaysIncludeCurrentDate) {
      const currentDate = new Date();
      const currentDateString = getDateStringFromDateObject(currentDate);
      if (!(currentDateString in newTasksPerDate)) {
        newTasksPerDate[currentDateString] = {
          tasks: [],
          periods: [],
          reminders: []
        };
      }
    }

    setTasksPerDate(newTasksPerDate);
  };

  useEffect(formatAndSetTasksPerDate, [
    tasks,
    periods,
    alwaysIncludeCurrentDate
  ]);

  useEffect(() => {
    setPastMonthsToShow(0)
    if (monthEnforcedDate && sectionListRef?.current) {
      try {
        sectionListRef.current.scrollToLocation({
          sectionIndex: 0,
          itemIndex: 0
        })
      } catch (err) {
        console.error(err)
      }
    }
  }, [monthEnforcedDate])

  const datesToShow = Object.keys(tasksPerDate).sort();

  const ListHeaderOrFooterComponent = ({ isFooter }: { isFooter: boolean }) => {
    if (rerenderingList) {
      return (
        <TransparentView style={styles.loadMoreButtonWrapper}>
          <PaddedSpinner spinnerColor="buttonDefault" />
        </TransparentView>
      );
    }
    return (isFooter && futureMonthsToShow < 24) ||
      (!isFooter && pastMonthsToShow < 24) ? (
      <TransparentView style={styles.loadMoreButtonWrapper}>
        <LinkButton
          title={isFooter ? t('common.loadMore') : t('common.loadOlder')}
          onPress={() => {
            // Suuuuuuuper hacky way to make the button
            // a little bit more responsive to clicks
            setRerenderingList(true);
            setTimeout(() => {
              if (isFooter) {
                setFutureMonthsToShow(futureMonthsToShow + 3);
              } else {
                setPastMonthsToShow(pastMonthsToShow + 3);
              }
            }, 300);
            setTimeout(() => {
              setRerenderingList(false);
            }, 2000);
          }}
          style={styles.loadMoreButton}
        />
      </TransparentView>
    ) : null;
  };

  const [futureSections, pastSections] = useMemo(() => {
    const future: { title: string; key: string; data: ItemData[] }[] = [];
    const past: { title: string; key: string; data: ItemData[] }[] = [];

    const currentlyShownDate = monthEnforcedDate ? new Date(monthEnforcedDate) : new Date()

    for (const date of datesToShow) {
      const sectionsArray = new Date(date) < currentlyShownDate
        ? past
        : future;

      const dayJsDate = dayjs(date)
      const dayName = `${dayJsDate.format('DD')} ${dayJsDate.format('MMMM')} ${dayJsDate.format(
        'YYYY'
      )}`;
      sectionsArray.push({
        title: dayName,
        key: dayName,
        data: [
          ...(tasksPerDate[date].tasks.map(task => ({ ...task, type: ("TASK" as ItemType) }))),
          ...(tasksPerDate[date].periods.map(period => ({ ...period, type: ("PERIOD" as ItemType) }))),
          ...(tasksPerDate[date].reminders.map(reminder => ({ ...reminder, type: ("REMINDER" as ItemType) }))),
        ]
      });
    }
    return [future, past];
  }, [datesToShow, monthEnforcedDate]);

  const shownSections = [
    ...pastSections.slice(pastSections.length - (pastMonthsToShow * 30)),
    ...futureSections.slice(0, (futureMonthsToShow * 30))
  ];

  console.log("FULL RERENDER")
  return (
    <SectionList
      sections={shownSections}
      renderSectionHeader={({ section }) => {
        return (
          <AlmostWhiteView style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{section.title}</Text>
          </AlmostWhiteView>
        );
      }}
      refreshing={false}
      onRefresh={() => {
        setPastMonthsToShow(0);
        setFutureMonthsToShow(3);
      }}
      renderItem={({ item }) => {
        return <TransparentPaddedView>
          <ListItem data={item} />
        </TransparentPaddedView>
      }}
      contentContainerStyle={{ paddingBottom: 150 }}
      ListHeaderComponent={<ListHeaderOrFooterComponent isFooter={false} />}
      ListFooterComponent={<ListHeaderOrFooterComponent isFooter={true} />}
      onViewableItemsChanged={(items) => {
        if (onChangeFirstDate) {
          updateDate(items.viewableItems[0]?.section?.data?.[0]?.date)
        }
      }}
      ref={sectionListRef}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    width: '100%',
    height: '100%'
  },
  spinnerWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionHeader: {
    justifyContent: 'center',
    paddingLeft: 18,
    paddingVertical: 20,
    marginBottom: 5,
    borderTopWidth: 2,
    borderBottomWidth: 2
  },
  sectionHeaderText: {
    fontSize: 20
  },
  loadMoreButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 60,
    alignItems: 'center'
  },
  loadMoreButton: {
    flex: 1,
    maxWidth: 200
  }
});

export default Calendar;
