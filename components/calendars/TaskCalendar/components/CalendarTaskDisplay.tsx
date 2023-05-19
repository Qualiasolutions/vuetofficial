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
import formatTasksAndPeriods from 'utils/formatTasksAndPeriods';

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
  const [firstDate, setFirstDate] = useState<Date>(new Date())

  const updateDate = (newDate: string) => {
    if (onChangeFirstDate && newDate) {
      onChangeFirstDate(newDate)
    }
  }

  useEffect(() => {
    const newTasksPerDate = formatTasksAndPeriods(tasks, periods, reminders, alwaysIncludeCurrentDate)
    setTasksPerDate(newTasksPerDate);
  }, [
    tasks,
    periods,
    alwaysIncludeCurrentDate
  ]);

  useEffect(() => {
    console.log("EFFECT")
    if (monthEnforcedDate && sectionListRef?.current && (Object.keys(tasksPerDate).length > 0)) {
      console.log(monthEnforcedDate)
      const newDate = new Date(monthEnforcedDate)
      if (firstDate && (firstDate < newDate)) {
        let sectionIndex = -1
        for (const date in tasksPerDate) {
          const dateObj = new Date(date)
          if ((dateObj < newDate) && (firstDate < dateObj)) {
            sectionIndex += 1
          }
        }

        if (sectionIndex >= 0) {
          // SCROLL TO THE RIGHT DATE
          console.log("SCROLLING TO DATE")
          console.log(tasksPerDate)
          try {
            sectionListRef.current.scrollToLocation({
              sectionIndex,
              itemIndex: 0
            })
          } catch (err) {
            console.error(err)
          }
        }
        return
      }

      // Otherwise scroll to the start and set
      // the first date to be the new date
      setPastMonthsToShow(0)
      setFirstDate(newDate)
      try {
        console.log("SCROLLING TO START")
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

    for (const date of datesToShow) {
      const sectionsArray = new Date(date) < firstDate
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
  }, [datesToShow, firstDate]);

  const shownSections = [
    ...pastSections.slice(pastSections.length - (pastMonthsToShow * 30)),
    ...futureSections.slice(0, (futureMonthsToShow * 30))
  ];

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
      renderItem={({ item, section, index }) => {
        return <TransparentPaddedView>
          <ListItem data={item} />
        </TransparentPaddedView>
      }}
      contentContainerStyle={{ paddingBottom: 150 }}
      ListHeaderComponent={<ListHeaderOrFooterComponent isFooter={false} />}
      ListFooterComponent={<ListHeaderOrFooterComponent isFooter={true} />}
      onViewableItemsChanged={(items) => {
        if (onChangeFirstDate) {
          if (items.viewableItems[0]?.section?.data?.[0]?.start_datetime) {
            const newDate = getDateStringFromDateObject(new Date(items.viewableItems[0]?.section?.data?.[0]?.start_datetime))
            updateDate(newDate)
          }
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
