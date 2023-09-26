import React, { useState } from 'react';
import { ContentTabScreenProps } from 'types/base';
import CategoryNavigator from 'navigation/CategoryNavigator';
import { useSelector } from 'react-redux';
import { selectCategoryById } from 'reduxStore/slices/categories/selectors';
import useCategoryHeader from 'headers/hooks/useCategoryHeader';
import {
  useCreateCategorySetupCompletionMutation,
  useGetCategorySetupCompletionsQuery
} from 'reduxStore/services/api/user';
import { FullPageSpinner, PaddedSpinner } from 'components/molecules/Spinners';
import { Text } from 'components/Themed';
import { Button } from 'components/molecules/ButtonComponents';
import useGetUserFullDetails from 'hooks/useGetUserDetails';
import { useTranslation } from 'react-i18next';
import { TransparentContainerView } from 'components/molecules/ViewComponents';
import { StyleSheet } from 'react-native';
import { CategoryName } from 'types/categories';

type CategoryListScreenProps = ContentTabScreenProps<'CategoryList'>;

const setupPagesTypes = StyleSheet.create({
  container: {
    justifyContent: 'flex-start'
  }
});

const SETUP_TEXT_PAGES: { [key in CategoryName]: string[] | null } = {
  TRANSPORT: [
    `
Transport Category allows users to record and action due dates and tasks for automobiles, motorcycles, boats, bicycles and more. Even Public Transportation.

Remember service dates, MOTs, insurance, warranty. Wash the car(s) monthly.
`,
    `
To get started, Choose “Cars & Motorcycles”, “Boats & Other” or “Public Transportation” and start added due dates or tasks!
`,
    `
Any tasks that cant be associated with one or more Transport entities can be added in My Transport Information. This includes  License numbers and expiration dates for various for multiple family members.
`
  ],
  FAMILY: null,
  PETS: ['PBF to add intro info here'],
  SOCIAL_INTERESTS: ['PBF to add intro info here'],
  EDUCATION: ['PBF to add intro info here'],
  CAREER: ['PBF to add intro info here'],
  TRAVEL: ['PBF to add intro info here'],
  HEALTH_BEAUTY: ['PBF to add intro info here'],
  HOME: ['PBF to add intro info here'],
  GARDEN: ['PBF to add intro info here'],
  FOOD: ['PBF to add intro info here'],
  LAUNDRY: ['PBF to add intro info here'],
  FINANCE: ['PBF to add intro info here']
};

const SetupPages = ({
  pages,
  category
}: {
  pages: string[];
  category: number;
}) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  const { data: userDetails } = useGetUserFullDetails();
  const [createCategoryCompletion, createCategoryCompletionResult] =
    useCreateCategorySetupCompletionMutation();

  if (!userDetails) {
    return null;
  }

  return (
    <TransparentContainerView style={setupPagesTypes.container}>
      <Text>{pages[currentPage]}</Text>
      {createCategoryCompletionResult.isLoading ? (
        <PaddedSpinner />
      ) : (
        <Button
          onPress={() => {
            if (currentPage === pages.length - 1) {
              createCategoryCompletion({
                user: userDetails.id,
                category
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

export default function CategoryListScreen({ route }: CategoryListScreenProps) {
  const category = useSelector(selectCategoryById(route.params.categoryId));
  useCategoryHeader(category?.name || '');

  const { data: categorySetupData, isLoading: isLoadingSetupData } =
    useGetCategorySetupCompletionsQuery(null as any);

  if (!category) {
    return null;
  }

  if (isLoadingSetupData || !categorySetupData) {
    return <FullPageSpinner />;
  }

  if (
    !categorySetupData
      .map((obj) => obj.category)
      .includes(route.params.categoryId)
  ) {
    const setupPages = SETUP_TEXT_PAGES[category.name];

    if (setupPages) {
      return (
        <SetupPages pages={setupPages} category={route.params.categoryId} />
      );
    }
  }

  return <CategoryNavigator categoryId={route.params.categoryId} />;
}
