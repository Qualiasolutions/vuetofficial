/*
  TaskCalendar - this is a calendar component for displaying tasks
*/

import CalendarTaskDisplay from './components/CalendarTaskDisplay';
import React, { useMemo, useState } from 'react';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { useDispatch } from 'react-redux';
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
import { Feather } from '@expo/vector-icons';
import { elevation } from 'styles/elevation';
import { useThemeColor } from 'components/Themed';
import { ScheduledTask } from 'types/tasks';
import { PrimaryText } from 'components/molecules/TextComponents';
import { t } from 'i18next';
import FiltersModal from 'components/molecules/FiltersModal';

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
  const { isLoading: isLoadingScheduledTasks } =
    useGetAllScheduledTasksQuery(undefined);
  const { isLoading: isLoadingTasks } = useGetAllTasksQuery(undefined);
  const dispatch = useDispatch();

  const primaryColor = useThemeColor({}, 'primary');
  const [showCalendar, setShowCalendar] = useState(false);
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);

  const calendarView = useMemo(() => {
    return (
      <CalendarView
        tasks={filteredTasks}
        entities={filteredEntities}
        onChangeDate={(date) => {
          dispatch(setEnforcedDate({ date }));
        }}
      />
    );
  }, [filteredTasks, filteredEntities, dispatch]);

  const listView = useMemo(() => {
    return (
      <TransparentView
        style={[styles.container, { marginBottom: MARGIN_BOTTOM }]}
      >
        <CalendarTaskDisplay
          tasks={filteredTasks}
          entities={filteredEntities}
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
    JSON.stringify(filteredTasks),
    JSON.stringify(filteredEntities),
    showFilters,
    reverse,
    headerStyle,
    headerTextStyle,
    dispatch
  ]);

  const isLoading =
    isLoadingTaskCompletionForms || isLoadingScheduledTasks || isLoadingTasks;
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
                  dispatch(setLastUpdateId(new Date()));
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
              size={24}
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
                setFiltersModalOpen(true);
              }}
              style={styles.headerButton}
            >
              <Feather name={'sliders'} size={24} color={primaryColor} />
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
              dispatch(setLastUpdateId(new Date()));
            }}
            style={styles.headerButton}
          >
            <Feather name={'sun'} size={24} color={primaryColor} />
            <PrimaryText
              style={styles.headerButtonText}
              text={t('common.today')}
            />
          </TouchableOpacity>
        </WhitePaddedView>
      </TransparentView>
      <WhiteView>{showCalendar ? calendarView : listView}</WhiteView>
      <FiltersModal
        visible={filtersModalOpen}
        onRequestClose={() => setFiltersModalOpen(false)}
      />
    </TransparentView>
  );
}

export default Calendar;
