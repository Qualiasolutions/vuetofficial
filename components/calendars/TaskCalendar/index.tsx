/*
  TaskCalendar - this is a calendar component for displaying tasks
*/

import CalendarTaskDisplay from './components/CalendarTaskDisplay';
import React, { useMemo, useState } from 'react';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { useDispatch } from 'react-redux';
import { RESOURCE_TYPE_TO_TYPE } from 'constants/ResourceTypes';

import {
  TransparentView,
  WhitePaddedView,
  WhiteView
} from 'components/molecules/ViewComponents';
import dayjs from 'dayjs';
import { FullPageSpinner } from 'components/molecules/Spinners';
import utc from 'dayjs/plugin/utc';
import CalendarView from 'components/molecules/CalendarViewV2';
import {
  getCurrentDateString,
  getDateStringFromDateObject
} from 'utils/datesAndTimes';
import {
  setEnforcedDate,
  setFiltersModalOpen,
  setLastUpdateId
} from 'reduxStore/slices/calendars/actions';
import MonthSelector from './components/MonthSelector';
import { useGetTaskCompletionFormsQuery } from 'reduxStore/services/api/taskCompletionForms';
import { ScheduledEntity } from './components/Task';
import {
  useGetAllScheduledTasksQuery,
  useGetAllTasksQuery
} from 'reduxStore/services/api/tasks';
import { TouchableOpacity } from 'components/molecules/TouchableOpacityComponents';
import Search from 'components/molecules/Search';
import { Feather } from '@expo/vector-icons';
import { elevation } from 'styles/elevation';
import { useThemeColor } from 'components/Themed';
import { ScheduledTask } from 'types/tasks';
import { PrimaryText } from 'components/molecules/TextComponents';
import { t } from 'i18next';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';

dayjs.extend(utc);

const MARGIN_BOTTOM = 0;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%'
  },
  monthSelectorSection: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 3
  },
  searchBox: {
    marginBottom: 3
  },
  monthSelectorWrapper: {
    marginRight: 20
  },
  todayButton: {
    marginHorizontal: 6
  },
  headerButton: { alignItems: 'center', marginHorizontal: 6 },
  headerButtonText: { fontSize: 11 }
});

type CalendarProps = {
  showFilters?: boolean;
  showAllTime?: boolean;
  reverse?: boolean;
  headerStyle?: ViewStyle;
  headerTextStyle?: TextStyle;
  filteredTasks: {
    [key: string]: ScheduledTask[];
  };
  filteredEntities?: { [key: string]: ScheduledEntity[] };
};
function Calendar({
  filteredTasks,
  filteredEntities,
  showFilters,
  reverse,
  headerStyle,
  headerTextStyle
}: CalendarProps) {
  // Force fetch the completion forms initially
  const { isLoading: isLoadingTaskCompletionForms } =
    useGetTaskCompletionFormsQuery(undefined);
  const { isLoading: isLoadingScheduledTasks, data: allScheduled } =
    useGetAllScheduledTasksQuery(undefined);
  const { isLoading: isLoadingTasks } = useGetAllTasksQuery(undefined);
  const { isLoading: isLoadingEntities, data: allEntities } =
    useGetAllEntitiesQuery(undefined);

  const dispatch = useDispatch();

  const primaryColor = useThemeColor({}, 'primary');
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [submittedSearchText, setSubmittedSearchText] = useState('');

  const fullFilteredTasks = useMemo(() => {
    const full: { [date: string]: ScheduledTask[] } = {};
    for (const date in filteredTasks) {
      const filtered = filteredTasks[date].filter((task) => {
        const scheduledTask =
          allScheduled?.byTaskId[task.id][
            task.recurrence_index === null ? -1 : task.recurrence_index
          ];

        if (!scheduledTask) {
          return false;
        }

        if (
          scheduledTask.title
            .toLowerCase()
            .includes(submittedSearchText.toLowerCase())
        ) {
          return true;
        }

        for (const entityId of scheduledTask.entities) {
          if (
            allEntities?.byId[entityId].name
              ?.toLowerCase()
              .includes(submittedSearchText.toLowerCase())
          ) {
            return true;
          }
        }

        for (const tagName of scheduledTask.tags) {
          if (
            tagName.toLowerCase().includes(submittedSearchText.toLowerCase())
          ) {
            return true;
          }
        }

        return false;
      });
      if (filtered.length > 0) {
        full[date] = filtered;
      }
    }
    return full;
  }, [filteredTasks, submittedSearchText, allEntities, allScheduled]);

  const fullFilteredEntities = useMemo(() => {
    const full: { [date: string]: ScheduledEntity[] } = {};
    for (const date in filteredEntities) {
      const filtered = filteredEntities[date].filter((entity) => {
        return allScheduled?.byEntityId[
          RESOURCE_TYPE_TO_TYPE[entity.resourcetype] || 'ENTITY'
        ][entity.id].title
          .toLowerCase()
          .includes(submittedSearchText.toLowerCase());
      });
      if (filtered.length > 0) {
        full[date] = filtered;
      }
    }
    return full;
  }, [filteredEntities, submittedSearchText, allScheduled]);

  const calendarView = useMemo(() => {
    return (
      <CalendarView
        tasks={fullFilteredTasks}
        entities={filteredEntities}
        onChangeDate={(date) => {
          dispatch(setEnforcedDate({ date }));
        }}
      />
    );
  }, [fullFilteredTasks, filteredEntities, dispatch]);

  const listView = useMemo(() => {
    return (
      <TransparentView
        style={[styles.container, { marginBottom: MARGIN_BOTTOM }]}
      >
        <CalendarTaskDisplay
          tasks={fullFilteredTasks}
          entities={fullFilteredEntities}
          alwaysIncludeCurrentDate={true}
          onChangeFirstDate={(date) => {
            dispatch(setEnforcedDate({ date }));
          }}
          reverse={reverse}
          headerStyle={headerStyle}
          headerTextStyle={headerTextStyle}
        />
      </TransparentView>
    );
  }, [
    JSON.stringify(fullFilteredTasks),
    JSON.stringify(fullFilteredEntities),
    showFilters,
    reverse,
    headerStyle,
    headerTextStyle,
    dispatch
  ]);

  const isLoading =
    isLoadingTaskCompletionForms ||
    isLoadingScheduledTasks ||
    isLoadingTasks ||
    isLoadingEntities;
  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <TransparentView style={styles.container}>
      <TransparentView>
        <WhitePaddedView
          style={[styles.monthSelectorSection, elevation.elevated]}
        >
          <TransparentView style={styles.monthSelectorWrapper}>
            <MonthSelector
              onValueChange={(date) => {
                if (date) {
                  const dateString = getDateStringFromDateObject(date);
                  dispatch(setEnforcedDate({ date: dateString }));
                  dispatch(setLastUpdateId(String(new Date())));
                }
              }}
            />
          </TransparentView>
          <TouchableOpacity
            onPress={() => {
              setShowCalendar(!showCalendar);
            }}
            style={styles.headerButton}
          >
            <Feather
              name={showCalendar ? 'list' : 'calendar'}
              size={20}
              color={primaryColor}
            />
            <PrimaryText
              style={styles.headerButtonText}
              text={showCalendar ? t('common.list') : t('common.month')}
            />
          </TouchableOpacity>
          {showFilters && (
            <TouchableOpacity
              onPress={() => {
                dispatch(setFiltersModalOpen(true));
              }}
              style={styles.headerButton}
            >
              <Feather name={'sliders'} size={20} color={primaryColor} />
              <PrimaryText
                style={styles.headerButtonText}
                text={t('components.calendar.filters')}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => {
              const today = getCurrentDateString();
              dispatch(setEnforcedDate({ date: today }));
              dispatch(setLastUpdateId(String(new Date())));
            }}
            style={styles.headerButton}
          >
            <Feather name={'sun'} size={20} color={primaryColor} />
            <PrimaryText
              style={styles.headerButtonText}
              text={t('common.today')}
            />
          </TouchableOpacity>
        </WhitePaddedView>
        <WhitePaddedView style={[elevation.elevated, styles.searchBox]}>
          <Search
            value={searchText}
            onChangeText={setSearchText}
            onSubmit={setSubmittedSearchText}
          />
        </WhitePaddedView>
      </TransparentView>
      <WhiteView>{showCalendar ? calendarView : listView}</WhiteView>
    </TransparentView>
  );
}

export default Calendar;
