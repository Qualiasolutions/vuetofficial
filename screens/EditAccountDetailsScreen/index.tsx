import {
  useMyAccountForm,
  MyAccountFormFieldTypes
} from './myAccountFormFieldTypes';
import RTKForm from 'components/forms/RTKForm';
import { deepCopy } from 'utils/copy';
import { useFormUpdateUserDetailsMutation } from 'reduxStore/services/api/user';
import { useTranslation } from 'react-i18next';

import { TransparentView } from 'components/molecules/ViewComponents';
import { StyleSheet } from 'react-native';
import { FullPageSpinner } from 'components/molecules/Spinners';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import getUserFullDetails from 'hooks/useGetUserDetails';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useMemo } from 'react';

const styles = StyleSheet.create({
  formContainer: {
    marginBottom: 20
  }
});

export default function EditAccountDetailsScreen() {
  const { data: userDetails } = getUserFullDetails();
  const { t } = useTranslation();
  const formFieldsTemplate = useMyAccountForm();

  const formFields = useMemo(() => {
    const fields = deepCopy(formFieldsTemplate);

    if (userDetails) {
      let fieldName: keyof typeof fields;
      for (fieldName in fields) {
        if (fieldName === 'profile_image') {
          fields.profile_image.initialValue =
            userDetails.presigned_profile_image_url || '';
        } else if (fieldName in userDetails) {
          fields[fieldName].initialValue = userDetails[fieldName] || '';
        }
      }
    }

    return fields;
  }, [formFieldsTemplate, userDetails]);

  if (!userDetails) {
    return <FullPageSpinner />;
  }

  return (
    <TransparentFullPageScrollView>
      <TransparentView style={styles.formContainer}>
        <RTKForm
          fields={formFields}
          methodHooks={{
            PATCH: useFormUpdateUserDetailsMutation
          }}
          formType="UPDATE"
          extraFields={{ userId: userDetails.id }}
          onSubmitSuccess={() => {
            Toast.show({
              type: 'success',
              text1: t('screens.myAccount.updateSuccess')
            });
          }}
          formDataType="json"
        />
      </TransparentView>
    </TransparentFullPageScrollView>
  );
}
