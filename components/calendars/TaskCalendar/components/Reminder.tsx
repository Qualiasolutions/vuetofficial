import { Pressable, StyleSheet } from 'react-native';
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
import { WhiteText, BlackText } from 'components/molecules/TextComponents';
import {
  TransparentView,
  WhiteView
} from 'components/molecules/ViewComponents';
import ColourBar from 'components/molecules/ColourBar';
import { StackNavigationProp } from '@react-navigation/stack';
import { ParsedReminder, PeriodResponse, ScheduledReminder } from 'types/periods';
import getUserFullDetails from 'hooks/useGetUserDetails';
import Checkbox from 'components/molecules/Checkbox';
import { useUpdateReminderMutation } from 'reduxStore/services/api/reminder';
import { TouchableOpacity } from 'components/molecules/TouchableOpacityComponents';
import { Image } from 'components/molecules/ImageComponents';
import { createSelector } from '@reduxjs/toolkit';
import { useGetAllPeriodsQuery, useGetScheduledPeriodsQuery } from 'reduxStore/services/api/period';
import useScheduledPeriods from 'hooks/useScheduledPeriods';

type PropTypes = { reminder: ParsedReminder; };

export default function Reminder({ reminder }: PropTypes) {
  const navigation = useNavigation<
    | BottomTabNavigationProp<RootTabParamList>
    | StackNavigationProp<EntityTabParamList>
    | StackNavigationProp<SettingsTabParamList>
  >();

  const { data: userDetails } = getUserFullDetails();
  const [selected, setSelected] = useState(false);

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

  const primaryColor = useThemeColor({}, 'primary');
  const greyColor = useThemeColor({}, 'grey');
  const isCompleteBackgroundColor = useThemeColor({}, 'grey');
  const isCompleteTextColor = useThemeColor({}, 'mediumGrey');

  const [triggerUpdateReminder, updateReminderResult] =
    useUpdateReminderMutation();

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

  if (isLoading || !allEntities) {
    return null;
  }

  if (error) {
    return <GenericError />;
  }

  const entity = allEntities.byId[reminder.entity];

  const familyMembersList = userFullDetails?.family?.users?.filter(
    (item: any) =>
      reminder.members.includes(item.id) || (entity && entity.owner === item.id)
  );
  const friendMembersList = userFullDetails?.friends?.filter(
    (item: any) =>
      reminder.members.includes(item.id) || (entity && entity.owner === item.id)
  );

  const membersList = [
    ...(familyMembersList || []),
    ...(friendMembersList || [])
  ];

  const leftInfo = <TransparentView style={styles.leftInfo} />;

  const expandedHeader =
    entity && selected ? (
      <Pressable
        onPress={() => {
          setSelected(false)
        }}
        style={[styles.expandedHeader, { backgroundColor: primaryColor }]}
      >
        <WhiteText
          text={entity?.name}
          style={styles.expandedTitle}
          bold={true}
        />
        <Pressable
          onPress={() =>
            (navigation.navigate as any)('EntityNavigator', {
              screen: 'EditEntity',
              initial: false,
              params: { entityId: entity.id }
            })
          }
          style={[styles.expandedHeader, { backgroundColor: primaryColor }]}
        >
          <Image
            source={require('assets/images/edit.png')}
            style={styles.editImage}
          />
        </Pressable>
      </Pressable>
    ) : null;

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
    <WhiteView
      style={[
        styles.container,
        entity &&
        selected && {
          ...styles.selectedTask,
          borderColor: greyColor
        },
        isComplete && {
          backgroundColor: isCompleteBackgroundColor
        }
      ]}
    >
      {expandedHeader}
      <TransparentView
        style={[
          styles.touchableContainerWrapper,
          selected && styles.selectedTouchableContainer
        ]}
      >
        <TouchableOpacity
          style={styles.touchableContainer}
          onPress={() => {
            if (!isComplete) {
              setSelected(true)
            }
          }}
        >
          {leftInfo}
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
        </TouchableOpacity>
        <Checkbox
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
        />
      </TransparentView>
      {memberColour}
      {!selected && (
        <TransparentView style={styles.separator}></TransparentView>
      )}
    </WhiteView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingTop: 10,
    borderRadius: 10,
    overflow: 'hidden'
  },
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
  touchableContainerWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  touchableContainer: {
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
  expandedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 13,
    height: 53
  },
  expandedTitle: {
    fontSize: 18
  },
  editImage: {
    height: 27,
    width: 31
  },
  selectedTask: {
    paddingTop: 0,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 15,
    shadowColor: '#000000',
    shadowOffset: { height: 0, width: 2 },
    shadowRadius: 5,
    shadowOpacity: 0.16,
    elevation: 5,
    borderWidth: 1
  },
  selectedTouchableContainer: { alignItems: 'flex-start', marginTop: 20 },
  memberColor: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 13
  }
});
