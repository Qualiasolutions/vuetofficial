import {
  myAccountForm,
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

export default function EditAccountDetailsScreen() {
  const { data: userDetails } = getUserFullDetails();
  const { t } = useTranslation();
  const formFields = deepCopy<MyAccountFormFieldTypes>(myAccountForm());

  if (!userDetails) {
    return <FullPageSpinner />;
  }

  if (userDetails) {
    let fieldName: keyof typeof formFields;
    for (fieldName in formFields) {
      if (fieldName === 'profile_image') {
        formFields.profile_image.initialValue =
          userDetails['presigned_profile_image_url'] || '';
      } else if (fieldName in userDetails) {
        formFields[fieldName].initialValue = userDetails[fieldName] || '';
      }
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
                type: "success",
                text1: t('screens.myAccount.updateSuccess')
              })
            }}
            formDataType="form"
          />
        </TransparentView>
      </TransparentFullPageScrollView>
    );
  }

  return <FullPageSpinner />;
}

const styles = StyleSheet.create({
  formContainer: {
    marginBottom: 20
  }
});
