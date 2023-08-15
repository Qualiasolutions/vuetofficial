/*
  TaskCalendar - this is a calendar component for displaying tasks (and periods)
*/

import CalendarTaskDisplay from './components/CalendarTaskDisplay';
import React, { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
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
import { getDateStringFromDateObject } from 'utils/datesAndTimes';
import {
  setListEnforcedDate,
  setMonthEnforcedDate
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

dayjs.extend(utc);

const MARGIN_BOTTOM = 0;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%'
  },
  monthSelectorSection: {
    paddingVertical: 12,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 3
  }
});

type CalendarProps = {
  showFilters?: boolean;
  filteredTasks: {
    [key: string]: ScheduledTask[];
  };
  filteredEntities?: { [key: string]: ScheduledEntity[] };
};
function Calendar({
  filteredTasks,
  filteredEntities,
  showFilters
}: CalendarProps) {
  // Force fetch the completion forms initially
  const { isLoading: isLoadingTaskCompletionForms } =
    useGetTaskCompletionFormsQuery(null as any);
  const { isLoading: isLoadingScheduledTasks } = useGetAllScheduledTasksQuery(
    null as any
  );
  const { isLoading: isLoadingTasks } = useGetAllTasksQuery(null as any);
  const dispatch = useDispatch();

  const primaryColor = useThemeColor({}, 'primary');
  const [showCalendar, setShowCalendar] = useState(false);

  const calendarView = useMemo(() => {
    return (
      <CalendarView
        tasks={filteredTasks}
        entities={filteredEntities}
        periods={[]}
        onChangeDate={(date) => {
          dispatch(setMonthEnforcedDate({ date }));
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
            dispatch(setListEnforcedDate({ date }));
          }}
          showFilters={showFilters}
        />
      </TransparentView>
    );
  }, [filteredTasks, filteredEntities, showFilters, dispatch]);

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
          <MonthSelector
            onValueChange={(date) => {
              if (date) {
                const dateString = getDateStringFromDateObject(date);
                dispatch(setMonthEnforcedDate({ date: dateString }));
                dispatch(setListEnforcedDate({ date: dateString }));
              }
            }}
          />
          {
            <TouchableOpacity
              onPress={() => {
                setShowCalendar(!showCalendar);
              }}
            >
              <Feather
                name={showCalendar ? 'list' : 'calendar'}
                size={24}
                color={primaryColor}
              />
            </TouchableOpacity>
          }
        </WhitePaddedView>
      </TransparentView>
      <WhiteView>{showCalendar ? calendarView : listView}</WhiteView>
    </TransparentView>
  );
}

export default Calendar;
