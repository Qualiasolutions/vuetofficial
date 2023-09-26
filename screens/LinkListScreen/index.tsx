import annualDates from './linkConfigs/annualDates';
import anniversaries from './linkConfigs/anniversaries';
import holidays from './linkConfigs/holidays';
import LinkList from 'components/lists/LinkList';
import useEntityTypeHeader from 'headers/hooks/useEntityTypeHeader';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { ContentTabScreenProps } from 'types/base';
import { useState } from 'react';
import { TransparentContainerView } from 'components/molecules/ViewComponents';
import { FullPageSpinner, PaddedSpinner } from 'components/molecules/Spinners';
import {
  useCreateLinkListSetupCompletionMutation,
  useGetLinkListCompletionsQuery
} from 'reduxStore/services/api/user';
import useGetUserFullDetails from 'hooks/useGetUserDetails';
import { Button } from 'components/molecules/ButtonComponents';
import { Text } from 'components/Themed';

const SETUP_TEXT_PAGES: {
  [key: string]: string[];
} = {
  anniversaries: ['PBF to add intro info here'],
  holidays: ['PBF to add intro info here']
};
const setupPagesStyles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start'
  }
});

const SetupPages = ({
  pages,
  listName
}: {
  pages: string[];
  listName: string;
}) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  const { data: userDetails } = useGetUserFullDetails();
  const [createLinkListCompletion, createLinkListCompletionResult] =
    useCreateLinkListSetupCompletionMutation();

  if (!userDetails) {
    return <FullPageSpinner />;
  }

  return (
    <TransparentContainerView style={setupPagesStyles.container}>
      <Text>{pages[currentPage]}</Text>
      {createLinkListCompletionResult.isLoading ? (
        <PaddedSpinner />
      ) : (
        <Button
          onPress={() => {
            if (currentPage === pages.length - 1) {
              createLinkListCompletion({
                user: userDetails.id,
                list_name: listName
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

type LinkListScreenProps = ContentTabScreenProps<'LinkList'>;

const listNameToLinks = {
  annualDates,
  anniversaries,
  holidays
};

export default function LinkListScreen({ route }: LinkListScreenProps) {
  const listName = route.params.listName;
  useEntityTypeHeader(listName);

  const { data: linkListCompletions } = useGetLinkListCompletionsQuery();

  if (!linkListCompletions) {
    return <FullPageSpinner />;
  }
  if (
    !linkListCompletions
      .map((linkListCompletion) => linkListCompletion.list_name)
      .includes(listName)
  ) {
    return (
      <SetupPages pages={SETUP_TEXT_PAGES[listName]} listName={listName} />
    );
  }

  return <LinkList links={listNameToLinks[listName]} />;
}
