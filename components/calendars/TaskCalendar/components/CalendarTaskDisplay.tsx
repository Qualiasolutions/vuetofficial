import { StyleSheet, SectionList, ViewToken } from 'react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import {
  getCurrentDateString,
  getDateStringFromDateObject
} from 'utils/datesAndTimes';

import { Text } from 'components/Themed';
import dayjs from 'dayjs';
import {
  AlmostWhiteView,
  TransparentView,
  WhitePaddedView
} from 'components/molecules/ViewComponents';
import { useSelector } from 'react-redux';
import { selectMonthEnforcedDate } from 'reduxStore/slices/calendars/selectors';
import Task, { MinimalScheduledTask } from './Task';
import { ITEM_HEIGHT } from './shared';
import ListHeaderComponent from './ListHeaderComponent';
import { useTranslation } from 'react-i18next';
import { useGetAllRoutinesQuery } from 'reduxStore/services/api/routines';
import Routine from './Routine';
import { selectTasksInDailyRoutines } from 'reduxStore/slices/tasks/selectors';

const styles = StyleSheet.create({
  sectionHeader: {
    justifyContent: 'center',
    paddingLeft: 18,
    borderTopWidth: 2,
    borderBottomWidth: 2
  },
  sectionHeaderText: {
    fontSize: 18
  },
  noTasksContainer: {
    height: '100%'
  }
});

type ItemType = 'TASK' | 'ROUTINE';
type ItemData = MinimalScheduledTask & { type: ItemType };
const isTask = (
  item: ItemData
): item is MinimalScheduledTask & { type: 'TASK' } => {
  return item.type === 'TASK';
};

const isRoutine = (
  item: ItemData
): item is MinimalScheduledTask & { type: 'ROUTINE' } => {
  return item.type === 'ROUTINE';
};

const ListItem = React.memo(
  ({ data, date }: { data: ItemData; date: string }) => {
    if (isTask(data)) {
      return <Task task={data} date={date} />;
    }
    if (isRoutine(data)) {
      return <Routine id={data.id} date={date} />;
    }
    return null;
  }
);

const SECTION_HEADER_HEIGHT = 40;

function Calendar({
  tasks,
  onChangeFirstDate,
  showFilters
}: {
  tasks: { [date: string]: MinimalScheduledTask[] };
  alwaysIncludeCurrentDate?: boolean;
  onChangeFirstDate?: (date: string) => void;
  showFilters?: boolean;
}) {
  const [pastMonthsToShow, setPastMonthsToShow] = useState(0);
  const [rerenderingList, setRerenderingList] = useState(false);
  const monthEnforcedDate = useSelector(selectMonthEnforcedDate);
  const tasksPerRoutine = useSelector(selectTasksInDailyRoutines);
  const sectionListRef = useRef<any>(null);
  const { t } = useTranslation();
  const { data: allRoutines } = useGetAllRoutinesQuery(null as any);

  const currentDate = useMemo(() => {
    return new Date(getCurrentDateString());
  }, []);

  const [firstDate, setFirstDate] = useState<Date>(currentDate);

  const updateDate = useCallback(
    (newDate: string) => {
      if (onChangeFirstDate && newDate) {
        onChangeFirstDate(newDate);
      }
    },
    [onChangeFirstDate]
  );

  const noTasks = Object.keys(tasks).length === 0;

  useEffect(() => {
    if (monthEnforcedDate && sectionListRef?.current) {
      const newDate = new Date(monthEnforcedDate);
      if (firstDate && firstDate < newDate) {
        let sectionIndex = -1;
        for (const date of Object.keys(tasks)) {
          const dateObj = new Date(date);
          if (dateObj < newDate && firstDate < dateObj) {
            sectionIndex += 1;
          }
        }

        if (sectionIndex >= 0) {
          // SCROLL TO THE RIGHT DATE
          try {
            sectionListRef.current.scrollToLocation({
              sectionIndex,
              itemIndex: 0
            });
          } catch (err) {
            console.error(err);
          }
        }
        return;
      }

      // Otherwise scroll to the start and set
      // the first date to be the new date
      setPastMonthsToShow(0);
      setFirstDate(newDate);
      if (Object.keys(tasks).length > 0) {
        try {
          sectionListRef.current.scrollToLocation({
            sectionIndex: 0,
            itemIndex: 0
          });
        } catch (err) {
          console.error(err);
        }
      }
    }
  }, [monthEnforcedDate]);

  const [futureSections, pastSections] = useMemo(() => {
    const datesToShow = Object.keys(tasks);

    if (!allRoutines) {
      return [[], []];
    }

    const future: { title: string; key: string; data: ItemData[] }[] = [];
    const past: { title: string; key: string; data: ItemData[] }[] = [];

    for (const date of datesToShow) {
      const sectionsArray = new Date(date) < firstDate ? past : future;

      const dayJsDate = dayjs(date);
      const dayName = `${dayJsDate.format('dd')} ${dayJsDate.format(
        'DD'
      )} ${dayJsDate.format('MMM')}`;

      const dailyTasksPerRoutine = tasksPerRoutine[date];

      // We want to only show the filtered tasks
      const permittedTasksOnDate = tasks[date];

      const routineIdsToShow = Object.keys(dailyTasksPerRoutine)
        .map((routineId) => parseInt(routineId))
        .filter(
          (routineId) =>
            routineId !== -1 &&
            permittedTasksOnDate.some(({ id: taskId }) =>
              dailyTasksPerRoutine[routineId]
                .map((tsk) => tsk.id)
                .includes(taskId)
            )
        );

      const tasksToShow = permittedTasksOnDate.filter(({ id: taskId }) =>
        dailyTasksPerRoutine[-1].map((tsk) => tsk.id).includes(taskId)
      );

      sectionsArray.push({
        title: dayName,
        key: dayJsDate.format('YYYY-MM-DD'),
        data: [
          ...routineIdsToShow.map((id) => ({
            id: id,
            recurrence_index: null,
            type: 'ROUTINE' as ItemType
          })),
          ...tasksToShow.map((task) => ({
            ...task,
            type: 'TASK' as ItemType
          }))
        ]
      });
    }
    return [future, past];
  }, [firstDate, tasks, allRoutines, tasksPerRoutine]);

  const shownSections = useMemo(() => {
    return [
      ...pastSections.slice(pastSections.length - pastMonthsToShow * 30),
      ...futureSections
    ];
  }, [futureSections, pastSections, pastMonthsToShow]);

  const HORIZONTAL_PADDING = 20;
  const renderItem = useCallback(
    ({ section, item }: { item: ItemData; section: { key: string } }) => {
      return (
        <TransparentView style={{ paddingHorizontal: HORIZONTAL_PADDING }}>
          <ListItem data={item} date={section.key} />
        </TransparentView>
      );
    },
    []
  );
  const onViewableItemsChanged = useCallback(
    (items: { viewableItems: ViewToken[] }) => {
      if (onChangeFirstDate) {
        if (items.viewableItems[0]?.section?.key) {
          const newDate = getDateStringFromDateObject(
            new Date(items.viewableItems[0]?.section?.key)
          );
          updateDate(newDate);
        }
      }
    },
    [onChangeFirstDate, updateDate]
  );

  const keyExtractor = useCallback((item: ItemData) => {
    return `${item.id}_${item.recurrence_index}_${item.type}`;
  }, []);

  const itemsLayout = useMemo(() => {
    if (!shownSections) return [];
    const layouts: any[] = [];
    let index = 0;
    let offset = 0;
    shownSections.forEach((section) => {
      // Section header
      const TOTAL_HEADER_HEIGHT = SECTION_HEADER_HEIGHT;
      layouts[index] = { length: TOTAL_HEADER_HEIGHT, offset, index };
      index++;
      offset += TOTAL_HEADER_HEIGHT;

      // Section items
      section.data.forEach(() => {
        /* -----------------------
         * We need to remove the last ItemSeparator from our calculations otherwise
         * we might offset our layout a little. As per the documentation, a ItemSeparatorComponent is
         * "Rendered in between adjacent Items within each section."
         * ----------------------- */
        const MATCH_HEIGHT = ITEM_HEIGHT;
        layouts[index] = {
          length: MATCH_HEIGHT,
          offset,
          index
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

  const PADDING_BOTTOM = 100;
  return (
    <>
      <SectionList
        sections={shownSections}
        initialNumToRender={10}
        removeClippedSubviews={true}
        scrollEventThrottle={1000}
        renderSectionHeader={({ section }) => {
          return (
            <AlmostWhiteView
              style={[styles.sectionHeader, { height: SECTION_HEADER_HEIGHT }]}
            >
              <Text style={styles.sectionHeaderText}>{section.title}</Text>
            </AlmostWhiteView>
          );
        }}
        refreshing={false}
        onRefresh={() => {
          setPastMonthsToShow(0);
        }}
        renderItem={renderItem}
        contentContainerStyle={noTasks ? {} : { paddingBottom: PADDING_BOTTOM }}
        ListHeaderComponent={
          <ListHeaderComponent
            loading={rerenderingList}
            showLoadMore={
              pastMonthsToShow < 24 &&
              pastSections.length > shownSections.length - futureSections.length
            }
            showFilters={!!showFilters}
            onLoadMore={() => {
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
          />
        }
        onViewableItemsChanged={onViewableItemsChanged}
        getItemLayout={(d, index) =>
          itemsLayout[index] ?? { length: 0, offset: 0, index }
        }
        keyExtractor={keyExtractor}
        ref={sectionListRef}
        windowSize={31}
      />
      {noTasks && (
        <WhitePaddedView style={styles.noTasksContainer}>
          <Text>{t('components.calendar.noTasks')}</Text>
        </WhitePaddedView>
      )}
    </>
  );
}

export default Calendar;
