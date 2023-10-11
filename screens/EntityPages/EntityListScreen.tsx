import { ContentTabScreenProps } from 'types/base';
import useEntityTypeHeader from 'headers/hooks/useEntityTypeHeader';
import EntityTypeNavigator from 'navigation/EntityTypeNavigator';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EntityTypeName } from 'types/entities';
import { TransparentContainerView } from 'components/molecules/ViewComponents';
import { StyleSheet } from 'react-native';
import { FullPageSpinner, PaddedSpinner } from 'components/molecules/Spinners';
import {
  useCreateEntityTypeSetupCompletionMutation,
  useGetEntityTypeSetupCompletionsQuery
} from 'reduxStore/services/api/user';
import useGetUserFullDetails from 'hooks/useGetUserDetails';
import { Button } from 'components/molecules/ButtonComponents';
import { Text } from 'components/Themed';

const SETUP_TEXT_PAGES: {
  [key in EntityTypeName]?: string[];
} = {
  SocialPlan: ['PBF to add intro info here'],
  SocialMedia: ['PBF to add intro info here'],
  Event: ['PBF to add intro info here'],
  Hobby: ['PBF to add intro info here']
};

const setupPagesTypes = StyleSheet.create({
  container: {
    justifyContent: 'flex-start'
  }
});

const SetupPages = ({
  pages,
  entityType
}: {
  pages: string[];
  entityType: EntityTypeName;
}) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  const { data: userDetails } = useGetUserFullDetails();
  const [createEntityTypeCompletion, createEntityTypeCompletionResult] =
    useCreateEntityTypeSetupCompletionMutation();

  if (!userDetails) {
    return null;
  }

  return (
    <TransparentContainerView style={setupPagesTypes.container}>
      <Text>{pages[currentPage]}</Text>
      {createEntityTypeCompletionResult.isLoading ? (
        <PaddedSpinner />
      ) : (
        <Button
          onPress={() => {
            if (currentPage === pages.length - 1) {
              createEntityTypeCompletion({
                user: userDetails.id,
                entity_type: entityType
              });
            } else {
              setCurrentPage(currentPage + 1);
            }
          }}
          title={t('common.continue')}
        />
      )}
    </TransparentContainerView>
  );
};

type EntityListScreenProps = ContentTabScreenProps<'EntityList'>;

export default function EntityListScreen({ route }: EntityListScreenProps) {
  useEntityTypeHeader(route.params.entityTypeName);
  const { data: setupCompletions, isFetching: isFetchingSetupCompletions } =
    useGetEntityTypeSetupCompletionsQuery(undefined);

  if (!setupCompletions || isFetchingSetupCompletions) {
    return <FullPageSpinner />;
  }

  const entityTypes = route.params.entityTypes;
  const setupPages = SETUP_TEXT_PAGES[entityTypes[0]];
  if (
    setupPages &&
    !setupCompletions
      .map((completion) => completion.entity_type)
      .includes(entityTypes[0])
  ) {
    return <SetupPages pages={setupPages} entityType={entityTypes[0]} />;
  }

  return (
    <EntityTypeNavigator
      entityTypes={entityTypes}
      entityTypeName={route.params.entityTypeName}
    />
  );
}
