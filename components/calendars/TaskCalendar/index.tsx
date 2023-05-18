/*
  TaskCalendar - this is a calendar component for displaying tasks (and periods)
*/

import CalendarTaskDisplay from './components/CalendarTaskDisplay';
import GenericError from 'components/molecules/GenericError';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { useGetAllScheduledTasksQuery } from 'reduxStore/services/api/tasks';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import {
  TransparentView,
  WhiteContainerView,
  WhitePaddedView
} from 'components/molecules/ViewComponents';
import { AlmostBlackText } from 'components/molecules/TextComponents';
import dayjs from 'dayjs';
import { FullPageSpinner } from 'components/molecules/Spinners';
import utc from 'dayjs/plugin/utc';
import useScheduledPeriods from 'hooks/useScheduledPeriods';
import { PeriodResponse, ScheduledReminder } from 'types/periods';
import { useTranslation } from 'react-i18next';
import CalendarView from 'components/molecules/CalendarView';
import Tabs from 'components/molecules/Tabs';
import { placeOverlappingPeriods } from 'utils/calendars';
import { useThemeColor, View } from 'components/Themed';
import { getDateStringFromDateObject, getUTCValuesFromDateString } from 'utils/datesAndTimes';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Image } from 'components/molecules/ImageComponents';
import getUserFullDetails from 'hooks/useGetUserDetails';
import { parsePresignedUrl } from 'utils/urls';
import { elevation } from 'styles/elevation';
import { setListEnforcedDate, setMonthEnforcedDate } from 'reduxStore/slices/calendars/actions';
import { selectEnforcedDate } from 'reduxStore/slices/calendars/selectors';
import { MinimalScheduledTask } from './components/Task';

dayjs.extend(utc);

const getOffsetMonthStartDateString = (
  date: Date,
  offset: number
): {
  date: Date;
  dateString: string;
} => {
  const dateCopy = new Date(date.getTime());
  dateCopy.setHours(0);
  dateCopy.setMinutes(0);
  dateCopy.setSeconds(0);
  dateCopy.setMilliseconds(0);
  dateCopy.setDate(1);
  dateCopy.setMonth(dateCopy.getMonth() + offset);
  return {
    date: dateCopy,
    dateString: dayjs.utc(dateCopy).format('YYYY-MM-DDTHH:mm:ss') + 'Z'
  };
};


const MonthSelector = ({ onValueChange, fullPage }: { onValueChange: (date: Date) => void, fullPage: boolean }) => {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)
  const enforcedDate = useSelector(selectEnforcedDate)
  const navigation = useNavigation()
  const { data: userDetails } = getUserFullDetails()
  const whiteColor = useThemeColor({}, "white")

  const { monthName, year } = enforcedDate
    ? getUTCValuesFromDateString(enforcedDate)
    : { monthName: "", year: "" }

  if (!userDetails) {
    return null
  }

  const imageSource = userDetails.presigned_profile_image_url
    ? { uri: parsePresignedUrl(userDetails.presigned_profile_image_url) }
    : require('assets/images/icons/camera.png');

  return <WhitePaddedView style={[
    {
      paddingVertical: 20,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    elevation.elevated
  ]}>
    {
      fullPage
        ? <Pressable
          onPress={() => (navigation as any).openDrawer()}
          style={[
            {
              height: 60,
              width: 60,
              marginLeft: 40,
              borderRadius: 30,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              backgroundColor: whiteColor
            },
            elevation.elevated,
          ]}
        >
          <Image
            source={imageSource}
            style={[
              {
                height: '100%',
                width: '100%',
                backgroundColor: whiteColor
              },
              !userDetails.presigned_profile_image_url && {
                height: 30,
                width: 30
              }
            ]}
          />
        </Pressable>
        : <View style={{ width: "20%" }}></View>
    }
    <Pressable
      onPress={() => {
        setIsDatePickerVisible(true)
      }}
      style={{ flexDirection: 'row', alignItems: 'center' }}
    >
      <AlmostBlackText text={`${monthName} ${year}`} style={{ fontWeight: 'bold', fontSize: 20, marginRight: 10 }} />
      <AlmostBlackText text="▼" />
    </Pressable>
    <View style={{ width: "20%" }}></View>
    <DateTimePickerModal
      isVisible={isDatePickerVisible}
      mode={'date'}
      date={enforcedDate ? new Date(enforcedDate) : undefined}
      onConfirm={(newValue) => {
        setIsDatePickerVisible(false);
        onValueChange(newValue);
      }}
      onCancel={() => {
        setIsDatePickerVisible(false);
      }}
    ></DateTimePickerModal>
  </WhitePaddedView>
}

type CalendarProps = {
  taskFilters: ((task: MinimalScheduledTask) => boolean)[];
  periodFilters: ((period: PeriodResponse) => boolean)[];
  reminderFilters: ((period: ScheduledReminder) => boolean)[];
  fullPage: boolean;
};
function Calendar({
  taskFilters,
  periodFilters,
  reminderFilters,
  fullPage
}: CalendarProps) {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const currentDate = new Date();
  const {
    periods: allScheduledPeriods,
    reminders: allScheduledReminders,
    isLoading: isLoadingPeriods
  } = useScheduledPeriods();

  // Load all scheduled tasks
  const {
    data: allScheduledTasks,
    error,
    isLoading: isLoadingScheduledTasks,
    isFetching: isFetchingScheduledTasks
  } = useGetAllScheduledTasksQuery(
    {
      start_datetime: getOffsetMonthStartDateString(currentDate, -24)
        .dateString,
      end_datetime: getOffsetMonthStartDateString(currentDate, 24).dateString,
    },
    { skip: !userDetails?.user_id }
  );


  const minimalScheduledTasks = useMemo(() => {
    return allScheduledTasks?.map(task => ({
      id: task.id,
      start_datetime: new Date(task.start_datetime),
      end_datetime: new Date(task.end_datetime),
      title: task.title,
      members: task.members,
      recurrence_index: task.recurrence_index,
      recurrence: task.recurrence,
      entity: task.entity,
      resourcetype: task.resourcetype
    }))
  }, [allScheduledTasks])


  const filteredTasks = useMemo<MinimalScheduledTask[]>(() => {
    if (!minimalScheduledTasks) {
      return [];
    }
    let filtered: MinimalScheduledTask[] = minimalScheduledTasks;
    for (const taskFilter of taskFilters) {
      filtered = filtered.filter(taskFilter);
    }
    return filtered;
  }, [
    JSON.stringify(minimalScheduledTasks),
    taskFilters
  ]);

  const filteredAllPeriods = useMemo<PeriodResponse[]>(() => {
    if (!allScheduledPeriods) {
      return [];
    } else {
      let filtered = allScheduledPeriods;
      for (const periodFilter of periodFilters) {
        filtered = filtered.filter(periodFilter);
      }
      return filtered;
    }
  }, [allScheduledPeriods, periodFilters]);

  const filteredAllReminders = useMemo<ScheduledReminder[]>(() => {
    if (!allScheduledReminders) {
      return [];
    } else {
      let filtered = allScheduledReminders;
      for (const reminderFilter of reminderFilters) {
        filtered = filtered.filter(reminderFilter);
      }
      return filtered;
    }
  }, [allScheduledReminders, reminderFilters]);

  const noTasks = useMemo(() => {
    return (
      filteredAllPeriods &&
      filteredAllReminders &&
      filteredAllPeriods.length === 0 &&
      filteredAllReminders.length === 0 &&
      filteredTasks.length === 0
    );
  }, [
    JSON.stringify(filteredTasks),
    JSON.stringify(filteredAllPeriods),
    JSON.stringify(filteredAllReminders),
  ]);

  const periodColour = useThemeColor({}, 'mediumLightGrey');

  const listView = useMemo(() => {
    console.log("LIST VIEWWWWW")
    if (error) {
      return () => null
    }
    if (!allScheduledTasks || !allScheduledPeriods) {
      return () => null
    }
    if (noTasks) {
      return () => null
    }

    return () => (
      <TransparentView style={{ marginBottom: 200 }}>
        <CalendarTaskDisplay
          tasks={filteredTasks}
          periods={filteredAllPeriods}
          reminders={filteredAllReminders}
          alwaysIncludeCurrentDate={true}
          onChangeFirstDate={(date) => {
            dispatch(setListEnforcedDate({ date }))
          }}
        />
      </TransparentView>
    );
  }, [
    JSON.stringify(filteredTasks),
    JSON.stringify(filteredAllPeriods),
    JSON.stringify(filteredAllReminders),
  ])

  const calendarView = useMemo(() => {
    console.log("CALENDAR VIEWWWWW")
    if (error) {
      return () => null
    }
    if (!allScheduledTasks || !allScheduledPeriods) {
      return () => null
    }
    if (noTasks) {
      return () => null
    }

    const periodsDates = placeOverlappingPeriods(filteredAllPeriods, periodColour);

    return () => <CalendarView
      dates={periodsDates}
      onChangeDate={(date) => {
        dispatch(setMonthEnforcedDate({ date }))
      }}
    />
  }, [
    JSON.stringify(filteredTasks),
    JSON.stringify(filteredAllPeriods),
    JSON.stringify(filteredAllReminders),
  ])


  if (error) {
    return <GenericError />;
  }

  const isLoading = isLoadingScheduledTasks || isLoadingPeriods;
  if (
    // If we include this then every time we poll for changes
    // we get a loading spinner - try and figure out how to
    // resolve this
    // isLoading ||
    // isFetchingScheduledTasks ||
    !allScheduledTasks ||
    !allScheduledPeriods
  ) {
    return <FullPageSpinner />;
  }

  if (noTasks) {
    return (
      <WhiteContainerView>
        <AlmostBlackText
          text={t('components.calendar.noTasks')}
          style={{ fontSize: 20 }}
        />
      </WhiteContainerView>
    );
  }

  const tabs = [
    {
      title: 'List',
      component: listView
    },
    {
      title: 'Month',
      component: calendarView
    },
  ];

  return (
    <TransparentView style={styles.container}>
      <MonthSelector
        onValueChange={(date) => {
          if (date) {
            const dateString = getDateStringFromDateObject(date)
            dispatch(setMonthEnforcedDate({ date: dateString }))
            dispatch(setListEnforcedDate({ date: dateString }))
          }
        }}
        fullPage={fullPage}
      />
      <Tabs tabs={tabs} />
    </TransparentView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%'
  }
});

export default Calendar;
