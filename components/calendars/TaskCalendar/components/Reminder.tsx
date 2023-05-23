import { StyleSheet } from 'react-native';
import { useThemeColor, View } from 'components/Themed';
import React, { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  EntityTabParamList,
  RootTabParamList,
  SettingsTabParamList
} from 'types/base';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useGetUserFullDetailsQuery } from 'reduxStore/services/api/user';

import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import GenericError from 'components/molecules/GenericError';
import { BlackText } from 'components/molecules/TextComponents';
import {
  TransparentView,
} from 'components/molecules/ViewComponents';
import ColourBar from 'components/molecules/ColourBar';
import { StackNavigationProp } from '@react-navigation/stack';
import { ParsedReminder, PeriodResponse } from 'types/periods';
import getUserFullDetails from 'hooks/useGetUserDetails';
import Checkbox from 'components/molecules/Checkbox';
import { useUpdateReminderMutation } from 'reduxStore/services/api/reminder';
import { createSelector } from '@reduxjs/toolkit';
import { useGetScheduledPeriodsQuery } from 'reduxStore/services/api/period';
import EntityTag from 'components/molecules/EntityTag';
import { ITEM_HEIGHT } from './shared';

type PropTypes = { reminder: ParsedReminder; };

export default function Reminder({ reminder }: PropTypes) {
  const selectIsComplete = useMemo(() => {
    // Return a unique selector instance for this page so that
    // the filtered results are correctly memoized
    return createSelector(
      (allPeriods: { data: PeriodResponse[] }) => {
        return allPeriods?.data || []
      },
      (data) => {
        const reminderPeriod = data?.find(period => (
          (period.id === reminder.period)
        ))
        if (reminderPeriod?.reminders) {
          const rem = reminderPeriod.reminders.find(r => r.id === reminder.id)
          if (rem) {
            return rem.is_complete
          }
        }
        return false
      }
    )
  }, [])

  const { data: userDetails } = getUserFullDetails();

  const [triggerUpdateReminder, updateReminderResult] =
    useUpdateReminderMutation();

  const { isComplete } = useGetScheduledPeriodsQuery(
    {
      start_datetime: "2020-01-01T00:00:00Z",
      end_datetime: "2030-01-01T00:00:00Z",
    },
    {
      selectFromResult: (result: any) => ({
        isComplete: selectIsComplete(result)
      })
    }
  )

  const navigation = useNavigation<
    | BottomTabNavigationProp<RootTabParamList>
    | StackNavigationProp<EntityTabParamList>
    | StackNavigationProp<SettingsTabParamList>
  >();
  const [showTaskForm, setShowTaskCompletionForm] = useState<boolean>(false);

  const {
    data: allEntities,
    isLoading,
    error
  } = useGetAllEntitiesQuery(userDetails?.id || -1, {
    skip: !userDetails?.id
  });

  const {
    data: userFullDetails,
    isLoading: isLoadingFullDetails,
    error: fullDetailsError
  } = useGetUserFullDetailsQuery(userDetails?.id || -1);

  const greyColor = useThemeColor({}, 'grey');
  const isCompleteTextColor = useThemeColor({}, 'mediumGrey');


  if (isLoading || !allEntities) {
    return null;
  }

  if (error) {
    return <GenericError />;
  }

  const familyMembersList = userFullDetails?.family?.users?.filter(
    (item: any) => reminder.members.includes(item.id)
  );
  const friendMembersList = userFullDetails?.friends?.filter((item: any) =>
    reminder.members.includes(item.id)
  );

  const membersList = [
    ...(familyMembersList || []),
    ...(friendMembersList || [])
  ];

  const entity = allEntities.byId[reminder.entity];

  const memberColour = (
    <TransparentView pointerEvents="none" style={styles.memberColor}>
      <ColourBar
        colourHexcodes={
          membersList?.map(({ member_colour }) => member_colour) || []
        }
      />
    </TransparentView>
  );

  return (
    <TransparentView style={{ borderBottomWidth: 1, paddingVertical: 5, height: ITEM_HEIGHT }}>
      <TransparentView
        style={[
          styles.containerWrapper,
        ]}
      >
        <TransparentView
          style={styles.container}
        >
          <TransparentView style={styles.titleContainer}>
            <BlackText
              text={reminder.title}
              style={[
                styles.title,
                isComplete && {
                  color: isCompleteTextColor
                }
              ]}
              bold={true}
            />
          </TransparentView>
        </TransparentView>
        {userDetails?.is_premium && <Checkbox
          disabled={isComplete}
          style={styles.checkbox}
          checked={isComplete}
          smoothChecking={true}
          color={isCompleteTextColor}
          onValueChange={async () => {
            await triggerUpdateReminder({
              id: reminder.id,
              is_complete: true
            });
          }}
        />}
      </TransparentView>
      <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <TransparentView style={{ flexDirection: 'row' }}>
          <EntityTag entity={entity} />
        </TransparentView>
        {memberColour}
      </TransparentView>
    </TransparentView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    width: '60%',
    flex: 1
  },
  title: {
    fontSize: 14,
    textAlign: 'left'
  },
  leftInfo: {
    width: '20%',
    marginRight: 0,
    marginLeft: 0
  },
  containerWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%'
  },
  checkbox: {
    margin: 10
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#eee'
  },
  memberColor: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 13
  }
});
