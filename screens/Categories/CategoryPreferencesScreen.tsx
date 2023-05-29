import { Button } from 'components/molecules/ButtonComponents';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { TransparentView } from 'components/molecules/ViewComponents';
import useEntityTypeHeader from 'headers/hooks/useEntityTypeHeader';
import { useTranslation } from 'react-i18next';
import { useGetAllCategoriesQuery } from 'reduxStore/services/api/api';
import { EntityTabScreenProps } from 'types/base';

type CategoryPreferencesScreenProps =
  EntityTabScreenProps<'CategoryPreferences'>;

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20
  },
  button: {}
};

export default function CategoryPreferencesScreen({
  route,
  navigation
}: CategoryPreferencesScreenProps) {
  const { t } = useTranslation();

  const { data: allCategories, isLoading, error } = useGetAllCategoriesQuery();
  const categoryData = allCategories?.byId[route.params.categoryId];

  useEntityTypeHeader(categoryData?.name || '');
  return (
    <TransparentFullPageScrollView contentContainerStyle={styles.container}>
      <TransparentView>
        <Button
          title={t('pageTitles.blockedDayPreferences')}
          onPress={() => {
            navigation.navigate('BlockedDaysSettings', {
              categoryId: route.params.categoryId
            });
          }}
          style={styles.button}
        />
      </TransparentView>
    </TransparentFullPageScrollView>
  );
}
