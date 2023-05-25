import React, { useState } from 'react';
import { EntityTabParamList, EntityTabScreenProps } from 'types/base';
import { useGetAllCategoriesQuery } from 'reduxStore/services/api/api';
import { FullPageSpinner } from 'components/molecules/Spinners';
import linkConfig from './subCategories';
import LinkList, { LinkListLink } from '../../components/lists/LinkList';
import useEntityTypeHeader from 'headers/hooks/useEntityTypeHeader';
import { TransparentView } from 'components/molecules/ViewComponents';
import ListButton from 'components/molecules/ListButton';
import { StyleSheet } from 'react-native';
import { categoryToIdMapping } from 'utils/categories';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

type CategoryListScreenProps = EntityTabScreenProps<'CategoryList'>;

const CategoryPreferences = ({ categoryId }: { categoryId: number }) => {
  const { data: allCategories, isLoading, error } = useGetAllCategoriesQuery();
  const categoryData = allCategories?.byId[categoryId];

  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<EntityTabParamList>>();

  return (
    <TransparentView>
      <ListButton
        text={t('screens.categoryList.categoryPreferences', {
          category: categoryData?.readable_name
        })}
        onPress={() => {
          navigation.navigate('CategoryPreferences', { categoryId });
        }}
        style={StyleSheet.flatten([styles.quickNavButton])}
      />
    </TransparentView>
  );
};

const QuickNav = ({ categoryId }: { categoryId: number }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const quickNavLinks: LinkListLink[] = [
    {
      name: 'generic.calendar',
      toScreen: 'CategoryCalendarScreen',
      navMethod: 'push',
      toScreenParams: {
        categoryId
      }
    }
  ];

  return (
    <TransparentView>
      <ListButton
        text={t('screens.categoryList.quickNav')}
        onPress={() => setOpen(!open)}
        style={StyleSheet.flatten([styles.quickNavButton])}
        iconName={open ? 'minus' : 'plus'}
      />
      {open && <LinkList links={quickNavLinks} />}
    </TransparentView>
  );
};

export default function CategoryListScreen({ route }: CategoryListScreenProps) {
  const { data: allCategories, isLoading, error } = useGetAllCategoriesQuery();
  const categoryData = allCategories?.byId[route.params.categoryId];

  useEntityTypeHeader(categoryData?.name || '');

  if (!categoryData) {
    return <FullPageSpinner />;
  }

  return (
    <TransparentView>
      <LinkList links={linkConfig[categoryData.name]} />
      <CategoryPreferences categoryId={route.params.categoryId} />
      <QuickNav categoryId={route.params.categoryId} />
    </TransparentView>
  );
}

const styles = StyleSheet.create({
  quickNavButton: {
    marginTop: 10
  }
});
