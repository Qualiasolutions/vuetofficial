import { NativeStackScreenProps } from '@react-navigation/native-stack';
import GenericError from 'components/molecules/GenericError';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { EntityTabParamList } from 'types/base';
import React, { useEffect } from 'react';
import ChildEntityList from './components/ChildEntityList';
import useGetUserDetails from 'hooks/useGetUserDetails';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { TransparentPaddedView } from 'components/molecules/ViewComponents';
import useEntityHeader from './headers/useEntityHeader';

export default function ChildEntitiesScreen({
  navigation,
  route
}: NativeStackScreenProps<EntityTabParamList, 'ChildEntitiesScreen'>) {
  const { data: userDetails } = useGetUserDetails();

  const {
    data: allEntities,
    isLoading: isLoadingEntities,
    error: entitiesError
  } = useGetAllEntitiesQuery(userDetails?.id || -1);

  const entityIdRaw = route.params.entityId;
  const entityId =
    typeof entityIdRaw === 'number' ? entityIdRaw : parseInt(entityIdRaw);
  const entity = allEntities?.byId[entityId];

  useEntityHeader(entityId)

  const isLoading = isLoadingEntities;

  if (isLoading || !entity) {
    return null;
  }

  if (entitiesError) {
    return <GenericError />;
  }

  return (
    <TransparentFullPageScrollView>
      <TransparentPaddedView>
        <ChildEntityList
          entityId={entityId}
          entityTypes={route.params.entityTypes}
          showCreateForm={route.params.showCreateForm}
        />
      </TransparentPaddedView>
    </TransparentFullPageScrollView>
  );
}
