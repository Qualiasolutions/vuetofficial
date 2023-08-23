import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ContentTabParamList } from 'types/base';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useEntityHeader from '../../../headers/hooks/useEntityHeader';
import EntityNavigator from 'navigation/EntityNavigator';
import { selectEntityById } from 'reduxStore/slices/entities/selectors';

export default function EntityScreen({
  navigation,
  route
}: NativeStackScreenProps<ContentTabParamList, 'EntityScreen'>) {
  const entityIdRaw = route.params.entityId;
  const entityId =
    typeof entityIdRaw === 'number' ? entityIdRaw : parseInt(entityIdRaw);
  const entity = useSelector(selectEntityById(entityId));
  // const isMemberEntity = !!useSelector(selectMemberEntityById(entityId));

  useEntityHeader(entityId);
  useEffect(() => {
    if (!entity) {
      navigation.goBack();
    }
  }, [entity, navigation]);

  if (!entity) {
    return null;
  }

  return <EntityNavigator entityId={entityId} />;
}
