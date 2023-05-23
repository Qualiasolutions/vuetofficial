import { StyleSheet, SectionList, ViewToken } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  getDateStringFromDateObject,
} from 'utils/datesAndTimes';

import { ParsedPeriod, ParsedReminder } from 'types/periods';
import { Text } from 'components/Themed';
import dayjs from 'dayjs';
import {
  AlmostWhiteView,
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
import { ITEM_HEIGHT } from './shared';

type SingleDateTasks = {
  tasks: MinimalScheduledTask[];
  periods: ParsedPeriod[];
  reminders: ParsedReminder[];
};

type AllDateTasks = {
  [key: string]: SingleDateTasks;
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

const SECTION_HEADER_HEIGHT = 40

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
    if (monthEnforcedDate && sectionListRef?.current && (Object.keys(tasksPerDate).length > 0)) {
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

  const ListHeaderComponent = () => {
    if (rerenderingList) {
      return (
        <TransparentView style={styles.loadMoreButtonWrapper}>
          <PaddedSpinner spinnerColor="buttonDefault" />
        </TransparentView>
      );
    }
    return (pastMonthsToShow < 24) ? (
      <TransparentView style={styles.loadMoreButtonWrapper}>
        <LinkButton
          title={t('common.loadOlder')}
          onPress={() => {
            // Suuuuuuuper hacky way to make the button
            // a little bit more responsive to clicks
            setRerenderingList(true);
            setTimeout(() => {
              setPastMonthsToShow(pastMonthsToShow + 3);
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
      const dayName = `${dayJsDate.format('dd')} ${dayJsDate.format('DD')} ${dayJsDate.format('MMM')}`;
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
    ...futureSections
  ];

  const renderItem = useCallback(({ item }: { item: ItemData }) => {
    return <TransparentView style={{ paddingHorizontal: 20 }}>
      <ListItem data={item} />
    </TransparentView>
  }, [])
  const onViewableItemsChanged = useCallback((items: { viewableItems: ViewToken[] }) => {
    if (onChangeFirstDate) {
      if (items.viewableItems[0]?.section?.data?.[0]?.start_datetime) {
        const newDate = getDateStringFromDateObject(new Date(items.viewableItems[0]?.section?.data?.[0]?.start_datetime))
        updateDate(newDate)
      }
    }
  }, [])

  const keyExtractor = useCallback((item: ItemData) => {
    if (isTask(item)) {
      return (`${item.id}_${item.resourcetype}`)
    }
    if (isPeriod(item)) {
      return (`${item.id}_${item.resourcetype}`)
    }
    if (isReminder(item)) {
      return (`${item.id}_reminder`)
    }
    return ""
  }, [])

  const itemsLayout = useMemo(() => {
    if (!shownSections) return [];
    const layouts: any[] = [];
    let index = 0;
    let offset = 0;
    shownSections.forEach(section => {
      // Section header
      const TOTAL_HEADER_HEIGHT = SECTION_HEADER_HEIGHT;
      layouts[index] = { length: TOTAL_HEADER_HEIGHT, offset, index };
      index++;
      offset += TOTAL_HEADER_HEIGHT;

      // Section items
      section.data.forEach((_match, i) => {
        /* -----------------------
         * We need to remove the last ItemSeparator from our calculations otherwise
         * we might offset our layout a little. As per the documentation, a ItemSeparatorComponent is
         * "Rendered in between adjacent Items within each section."
         * ----------------------- */
        const MATCH_HEIGHT = ITEM_HEIGHT;
        layouts[index] = {
          length: MATCH_HEIGHT,
          offset,
          index,
        };
        index++;
        offset += MATCH_HEIGHT;
      });

      // Section footer
      layouts[index] = { length: 0, offset, index };
      index++;
    });
    return layouts;
  }, [shownSections]);

  return (
    <SectionList
      sections={shownSections}
      renderSectionHeader={({ section }) => {
        return (
          <AlmostWhiteView style={[styles.sectionHeader, { height: SECTION_HEADER_HEIGHT }]}>
            <Text style={styles.sectionHeaderText}>{section.title}</Text>
          </AlmostWhiteView>
        );
      }}
      refreshing={false}
      onRefresh={() => {
        setPastMonthsToShow(0);
      }}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 150 }}
      ListHeaderComponent={<ListHeaderComponent />}
      onViewableItemsChanged={onViewableItemsChanged}
      getItemLayout={(d, index) => itemsLayout[index] ?? { length: 0, offset: 0, index }}
      keyExtractor={keyExtractor}
      ref={sectionListRef}
      windowSize={31}
    />
  );
}

const styles = StyleSheet.create({
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
    borderTopWidth: 2,
    borderBottomWidth: 2
  },
  sectionHeaderText: {
    fontSize: 18
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
