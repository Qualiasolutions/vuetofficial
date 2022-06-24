import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Calendar from 'components/calendars/Calendar';
import GenericError from 'components/molecules/GenericError';
import SquareButton from 'components/molecules/SquareButton';
import { Text, View } from 'components/Themed';
import { Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/api';
import { useGetAllScheduledTasksQuery } from 'reduxStore/services/api/tasks';

import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { RootTabParamList } from 'types/base';
import { ScheduledTaskResponseType } from 'types/tasks';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';

const getTasksByEntityId = (
  allTasks: ScheduledTaskResponseType[],
  entityId: string | number
) => {
  const integerEntityId =
    typeof entityId === 'number' ? entityId : parseInt(entityId);
  return allTasks.filter((task) => task.entity === integerEntityId);
};

export const EntityScreen = ({
  navigation,
  route
}: NativeStackScreenProps<RootTabParamList, 'EntityScreen'>) => {
  const username = useSelector(selectUsername)
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const {
    data: allEntities,
    isLoading: isLoadingEntities,
    error: entitiesError
  } = useGetAllEntitiesQuery(userDetails?.user_id || -1);

  const currentMonthStart = new Date();
  currentMonthStart.setDate(1);
  const nextMonthStart = new Date();
  nextMonthStart.setMonth(nextMonthStart.getMonth() + 1);
  nextMonthStart.setDate(1);
  const [startDate, setStartDate] = React.useState<Date>(currentMonthStart);
  const [endDate, setEndDate] = React.useState<Date>(nextMonthStart);
  const {
    data: allTasks,
    error: tasksError,
    isLoading: isLoadingTasks
  } = useGetAllScheduledTasksQuery({
    start_datetime: `${startDate.getFullYear()}${(
      '0' +
      (startDate.getMonth() + 1)
    ).slice(-2)}01T00:00:00Z`,
    end_datetime: `${endDate.getFullYear()}${(
      '0' +
      (endDate.getMonth() + 1)
    ).slice(-2)}01T00:00:00Z`,
    user_id: userDetails?.user_id || -1
  });

  const isLoading = isLoadingEntities || isLoadingTasks;

  if (
    isLoading ||
    !allTasks ||
    !allEntities ||
    !route.params?.entityId ||
    !allEntities
  ) {
    return null;
  }

  if (entitiesError || tasksError) {
    return <GenericError />;
  }

  const entityIdRaw = route.params.entityId;
  const entityId =
    typeof entityIdRaw === 'number' ? entityIdRaw : parseInt(entityIdRaw);
  const entity = allEntities.byId[entityId];
  const entityTasks = getTasksByEntityId(allTasks, route.params.entityId);

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.entityHeader}>
          <Text style={styles.entityTitle}>{entity?.name}</Text>
          <SquareButton
            fontAwesomeIconName="pencil"
            fontAwesomeIconSize={20}
            onPress={() => {
              navigation.navigate('EditEntity', { entityId: entity.id });
            }}
          />
        </View>
        <View style={styles.calendarContainer}>
          <Calendar tasks={entityTasks} />
          <Button
            title="LOAD MORE DATES"
            onPress={() => {
              const newEndDate = new Date(endDate);
              newEndDate.setMonth(newEndDate.getMonth() + 1);
              setEndDate(newEndDate);
            }}
          />
        </View>
        <View style={styles.addTaskWrapper}>
          <SquareButton
            fontAwesomeIconName="plus"
            onPress={() =>
              navigation.navigate('AddTask', { entityId: entity.id })
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    height: '100%'
  },
  contentContainer: {
    padding: 10,
    height: '100%'
  },
  entityHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#efefef',
    borderBottomWidth: 2,
    paddingBottom: 10
  },
  entityTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 20
  },
  calendarContainer: {
    height: '80%',
    paddingBottom: 10,
    borderBottomColor: '#efefef',
    borderBottomWidth: 2
  },
  addTaskWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingRight: 20
  }
});
