import { StyleSheet } from 'react-native';
import DayCalendar from './DayCalendar/DayCalendar';
import React, { useMemo, useRef, useState } from 'react';

import {
  getDateStringFromDateObject,
  getDateStringsBetween,
  getDateWithoutTimezone,
  getUTCValuesFromDateString
} from 'utils/datesAndTimes';

import {
  ScheduledTaskResponseType,
  ScheduledTaskParsedType
} from 'types/tasks';

import { PeriodResponse, ScheduledReminder } from 'types/periods';
import { placeOverlappingPeriods } from 'utils/calendars';
import { Text, useThemeColor } from 'components/Themed';
import { SectionList } from 'components/molecules/SectionListComponents';
import dayjs from 'dayjs';
import {
  AlmostWhiteView,
  TransparentView
} from 'components/molecules/ViewComponents';
import { LinkButton } from 'components/molecules/ButtonComponents';
import { PaddedSpinner } from 'components/molecules/Spinners';
import { t } from 'i18next';

type ParsedPeriod = Omit<PeriodResponse, 'end_date' | 'start_date'> & {
  end_date: Date;
  start_date: Date;
};

type ParsedReminder = Omit<ScheduledReminder, 'end_date' | 'start_date'> & {
  end_date: Date;
  start_date: Date;
};

type SingleDateTasks = {
  tasks: ScheduledTaskParsedType[];
  periods: ParsedPeriod[];
  reminders: ParsedReminder[];
};

type AllDateTasks = {
  [key: string]: SingleDateTasks;
};

const parseTaskResponse = (
  res: ScheduledTaskResponseType
): ScheduledTaskParsedType => {
  return {
    ...res,
    end_datetime: new Date(res.end_datetime),
    start_datetime: new Date(res.start_datetime)
  };
};

const parsePeriodResponse = (res: PeriodResponse): ParsedPeriod => {
  return {
    ...res,
    end_date: getDateWithoutTimezone(res.end_date),
    start_date: getDateWithoutTimezone(res.start_date)
  };
};

const parseReminder = (res: ScheduledReminder): ParsedReminder => {
  return {
    ...res,
    end_date: getDateWithoutTimezone(res.end_date),
    start_date: getDateWithoutTimezone(res.start_date)
  };
};

function Calendar({
  tasks,
  periods,
  reminders,
  onChangeFirstDate,
  defaultDate,
  alwaysIncludeCurrentDate = false
}: {
  tasks: ScheduledTaskResponseType[];
  periods: PeriodResponse[];
  reminders: ScheduledReminder[];
  alwaysIncludeCurrentDate?: boolean;
  onChangeFirstDate?: (date: string) => void;
  defaultDate?: string | null;
}) {
  const [tasksPerDate, setTasksPerDate] = React.useState<AllDateTasks>({});
  const primaryColor = useThemeColor({}, 'primary');
  const periodsDates = placeOverlappingPeriods(periods, primaryColor, false);

  const [futureMonthsToShow, setFutureMonthsToShow] = useState(3);
  const [pastMonthsToShow, setPastMonthsToShow] = useState(0);
  const [rerenderingList, setRerenderingList] = useState(false);

  const updateDateTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const updateDate = (newDate: string) => {
    if (updateDateTimeout.current) {
      clearTimeout(updateDateTimeout.current)
    }

    updateDateTimeout.current = setTimeout(() => {
      if (onChangeFirstDate && newDate) {
        onChangeFirstDate(newDate)
      }
    }, 500)
  }


  const formatAndSetTasksPerDate = (): void => {
    const newTasksPerDate: AllDateTasks = {};
    for (const task of tasks) {
      const parsedTask = parseTaskResponse(task);
      const taskDates = getDateStringsBetween(
        parsedTask.start_datetime,
        parsedTask.end_datetime
      );

      for (const taskDate of taskDates) {
        if (newTasksPerDate[taskDate]) {
          newTasksPerDate[taskDate].tasks.push(parsedTask);
        } else {
          newTasksPerDate[taskDate] = {
            tasks: [parsedTask],
            periods: [],
            reminders: []
          };
        }
      }
    }

    for (const period of periods) {
      const parsedPeriod = parsePeriodResponse(period);
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

    for (const reminder of reminders) {
      const parsedReminder = parseReminder(reminder);
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

  React.useEffect(formatAndSetTasksPerDate, [
    tasks,
    periods,
    alwaysIncludeCurrentDate
  ]);

  const datesToShow = Object.keys(tasksPerDate).sort();

  type SectionData = {
    date: string;
  };

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
    const future: { title: string; key: string; data: SectionData[] }[] = [];
    const past: { title: string; key: string; data: SectionData[] }[] = [];

    const currentlyShownDate = defaultDate ? new Date(defaultDate) : new Date()
    for (const date of datesToShow) {
      const sectionsArray = new Date(date) < currentlyShownDate
        ? past
        : future;

      const dayJsDate = dayjs(date)
      const dayName = `${dayJsDate.format('DD')} ${dayJsDate.format('MMMM')} ${dayJsDate.format(
        'YYYY'
      )}`;
      const existingSection = sectionsArray.find(
        (section) => section.title === dayName
      );
      const dateData = { date };
      if (existingSection) {
        existingSection.data.push(dateData);
      } else {
        sectionsArray.push({
          title: dayName,
          key: dayName,
          data: [dateData]
        });
      }
    }
    return [future, past];
  }, [datesToShow, defaultDate]);

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
      renderItem={({ item: { date } }) => {
        return (
          <DayCalendar
            date={date}
            key={date}
            tasks={tasksPerDate[date].tasks}
            periods={tasksPerDate[date].periods}
            reminders={tasksPerDate[date].reminders}
            markedPeriods={periodsDates[date]}
            highlight={date === getDateStringFromDateObject(new Date())}
          />
        );
      }}
      contentContainerStyle={{ paddingBottom: 150 }}
      ListHeaderComponent={<ListHeaderOrFooterComponent isFooter={false} />}
      ListFooterComponent={<ListHeaderOrFooterComponent isFooter={true} />}
      onViewableItemsChanged={(items) => {
        if (onChangeFirstDate) {
          updateDate(items.viewableItems[0]?.section?.data?.[0]?.date)
        }
      }}
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
