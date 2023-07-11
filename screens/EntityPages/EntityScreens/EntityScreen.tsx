import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ContentTabParamList } from 'types/base';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useEntityHeader from '../../../headers/hooks/useEntityHeader';
import EntityNavigator from 'navigation/EntityNavigator';
import {
  selectEntityById,
  selectMemberEntityById
} from 'reduxStore/slices/entities/selectors';
import { Text } from 'components/Themed';
import { useTranslation } from 'react-i18next';
import { TransparentContainerView } from 'components/molecules/ViewComponents';

export default function EntityScreen({
  navigation,
  route
}: NativeStackScreenProps<ContentTabParamList, 'EntityScreen'>) {
  const entityIdRaw = route.params.entityId;
  const entityId =
    typeof entityIdRaw === 'number' ? entityIdRaw : parseInt(entityIdRaw);
  const entity = useSelector(selectEntityById(entityId));
  const isMemberEntity = !!useSelector(selectMemberEntityById(entityId));

  const { t } = useTranslation();

  useEntityHeader(entityId);
  useEffect(() => {
    if (!entity) {
      navigation.goBack();
    }
  }, [entity, navigation]);

  if (!entity) {
    return null;
  }

  if (!isMemberEntity) {
    return (
      <TransparentContainerView>
        <Text>{t('screens.entityScreen.noPermsBlurb')}</Text>
      </TransparentContainerView>
    );
  }

  return <EntityNavigator entityId={entityId} />;
}
