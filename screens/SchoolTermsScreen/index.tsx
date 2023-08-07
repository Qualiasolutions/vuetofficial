import { Button } from 'components/molecules/ButtonComponents';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { FullPageSpinner } from 'components/molecules/Spinners';
import {
  TransparentPaddedView,
  TransparentView
} from 'components/molecules/ViewComponents';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useGetAllSchoolTermsQuery } from 'reduxStore/services/api/schoolTerms';

const styles = StyleSheet.create({
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center'
  }
});
export default function SchoolTermsScreen() {
  const { data: schoolTerms, isLoading: isLoadingSchoolTerms } =
    useGetAllSchoolTermsQuery();
  const [addingTerm, setAddingTerm] = useState(false);
  const { t } = useTranslation();

  if (isLoadingSchoolTerms || !schoolTerms) {
    return <FullPageSpinner />;
  }

  if (addingTerm) {
    return (
      <TransparentFullPageScrollView>
        <TransparentPaddedView>
          <TransparentView style={styles.buttonWrapper}>
            <Button
              title={t('common.back')}
              onPress={() => setAddingTerm(false)}
            />
          </TransparentView>
        </TransparentPaddedView>
      </TransparentFullPageScrollView>
    );
  }

  return (
    <TransparentFullPageScrollView>
      <TransparentPaddedView>
        <TransparentView style={styles.buttonWrapper}>
          <Button title={t('common.add')} onPress={() => setAddingTerm(true)} />
        </TransparentView>
      </TransparentPaddedView>
    </TransparentFullPageScrollView>
  );
}
