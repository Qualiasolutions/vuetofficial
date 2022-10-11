import { Image, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useThemeColor, View } from 'components/Themed';
import { isFixedTaskParsedType, ScheduledTaskParsedType } from 'types/tasks';
import { getTimeStringFromDateObject } from 'utils/datesAndTimes';
import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import SquareButton from 'components/molecules/SquareButton';
import { useNavigation } from '@react-navigation/native';
import {
  EntityTabParamList,
  RootTabParamList,
  SettingsTabParamList
} from 'types/base';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import TaskCompletionForm from 'components/forms/TaskCompletionForms/TaskCompletionForm';
import {
  useGetUserDetailsQuery,
  useGetUserFullDetailsQuery
} from 'reduxStore/services/api/user';
import { useUpdateTaskMutation } from 'reduxStore/services/api/tasks';
import { useCreateTaskCompletionFormMutation } from 'reduxStore/services/api/taskCompletionForms';

import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import GenericError from 'components/molecules/GenericError';
import {
  WhiteText,
  PrimaryText,
  BlackText
} from 'components/molecules/TextComponents';
import Layout from 'constants/Layout';
import { Feather } from '@expo/vector-icons';
import {
  TransparentView,
  WhiteView
} from 'components/molecules/ViewComponents';
import Checkbox from 'components/molecules/Checkbox';
import ColourBar from 'components/molecules/ColourBar';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { ParsedPeriod } from 'types/periods';
import getUserFullDetails from 'hooks/useGetUserDetails';

type PropTypes = {
  period: ParsedPeriod;
  selected: boolean;
  onPress: (event: ParsedPeriod) => void;
  onHeaderPress: (event: ParsedPeriod) => void;
};

export default function OneDayPeriod({
  period,
  selected,
  onPress,
  onHeaderPress
}: PropTypes) {
  const navigation = useNavigation<
    | BottomTabNavigationProp<RootTabParamList>
    | StackNavigationProp<EntityTabParamList>
    | StackNavigationProp<SettingsTabParamList>
  >();
  const [showTaskForm, setShowTaskCompletionForm] = useState<boolean>(false);

  const { data: userDetails } = getUserFullDetails();

  const [triggerCreateCompletionForm, createCompletionFormResult] =
    useCreateTaskCompletionFormMutation();

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

  const [triggerUpdateTask, updateTaskResult] = useUpdateTaskMutation();

  const primaryColor = useThemeColor({}, 'primary');
  const greyColor = useThemeColor({}, 'grey');

  const { t } = useTranslation();

  if (isLoading || !allEntities) {
    return null;
  }

  if (error) {
    return <GenericError />;
  }

  const familyMembersList = userFullDetails?.family?.users?.filter(
    (item: any) => period.members.includes(item.id)
  );
  const friendMembersList = userFullDetails?.friends?.filter((item: any) =>
    period.members.includes(item.id)
  );

  const membersList = [
    ...(familyMembersList || []),
    ...(friendMembersList || [])
  ];

  const entity = allEntities.byId[period.entity];

  const leftInfo = (
    <View style={styles.leftInfo}>
      {/* <Text> {getTimeStringFromDateObject(task.start_datetime)} </Text>
      <Text> {getTimeStringFromDateObject(task.end_datetime)} </Text> */}
    </View>
  );

  const expandedHeader =
    entity && selected ? (
      <Pressable
        onPress={() => onHeaderPress(period)}
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
          }
      ]}
    >
      {expandedHeader}
      <View
        style={[
          styles.touchableContainerWrapper,
          selected && styles.selectedTouchableContainer
        ]}
      >
        <TouchableOpacity
          style={styles.touchableContainer}
          onPress={() => {
            onPress(period);
          }}
        >
          {leftInfo}
          <View style={styles.titleContainer}>
            <BlackText text={period.title} style={styles.title} bold={true} />
          </View>
        </TouchableOpacity>
      </View>
      {selected &&
      ['FixedTask', 'FlexibleTask'].includes(period.resourcetype) ? (
        <Pressable
          onPress={() =>
            (navigation.navigate as any)('EditTask', { taskId: period.id })
          }
          style={styles.viewEditContainer}
        >
          <PrimaryText text={t('components.calendar.task.viewOrEdit')} />
        </Pressable>
      ) : null}
      {memberColour}
      {!selected && <View style={styles.separator}></View>}
    </WhiteView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Layout.window.width - 100,
    marginTop: 10
  },
  titleContainer: {
    width: '40%'
  },
  title: {
    fontSize: 14,
    textAlign: 'left'
  },
  leftInfo: {
    width: '20%',
    marginRight: 30,
    marginLeft: 13
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
  viewEditContainer: {
    marginTop: 10,
    paddingTop: 0,
    marginLeft: 30
  },
  checkbox: {
    margin: 10
  },
  separator: {
    marginTop: 20,
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
  expandedOptions: {
    marginTop: 10,
    alignItems: 'flex-end'
  },
  expandedButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 5
  },
  editImage: {
    height: 27,
    width: 31
  },
  selectedTask: {
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
  buttonTextStyle: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 12
  },
  selectedTouchableContainer: { alignItems: 'flex-start', marginTop: 20 },
  memberColor: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 13
  }
});
