import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Calendar from 'components/calendars/Calendar';
import GenericError from 'components/molecules/GenericError';
import SquareButton from 'components/molecules/SquareButton';
import { Text, View } from 'components/Themed';
import {
  Button,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { useGetAllScheduledTasksQuery } from 'reduxStore/services/api/tasks';

import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { RootTabParamList } from 'types/base';
import { ScheduledTaskResponseType } from 'types/tasks';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import ListEntityScreen from './components/ListEntityScreen';
import { AlmostBlackText } from 'components/molecules/TextComponents';
import { WhiteView } from 'components/molecules/ViewComponents';
import ChildEntityListScreen from './components/ChildEntityListScreen';

export const EntityScreen = ({
  navigation,
  route
}: NativeStackScreenProps<RootTabParamList, 'EntityScreen'>) => {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const {
    data: allEntities,
    isLoading: isLoadingEntities,
    error: entitiesError
  } = useGetAllEntitiesQuery(userDetails?.user_id || -1);

  const entityIdRaw = route.params.entityId;
  const entityId =
    typeof entityIdRaw === 'number' ? entityIdRaw : parseInt(entityIdRaw);
  const entity = allEntities?.byId[entityId];

  useEffect(() => {
    navigation.setOptions({
      headerTitle: entity?.name
    });
  }, [entity]);

  const isLoading = isLoadingEntities;

  if (isLoading || !entity) {
    return null;
  }

  if (entitiesError) {
    return <GenericError />;
  }

  if (entity.resourcetype === 'List') {
    return <ListEntityScreen entityId={entityId} />;
  } else {
    return <ChildEntityListScreen entityId={entityId} />;
  }
};
