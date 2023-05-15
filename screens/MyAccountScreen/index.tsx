import {
  myAccountForm,
  MyAccountFormFieldTypes
} from './myAccountFormFieldTypes';
import RTKForm from 'components/forms/RTKForm';
import { deepCopy } from 'utils/copy';
import { useFormUpdateUserDetailsMutation } from 'reduxStore/services/api/user';
import { useTranslation } from 'react-i18next';

import { useState } from 'react';
import { TransparentPaddedView, TransparentView, WhitePaddedView } from 'components/molecules/ViewComponents';
import { StyleSheet } from 'react-native';
import { FullPageSpinner } from 'components/molecules/Spinners';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import getUserFullDetails from 'hooks/useGetUserDetails';
import { BlackText } from 'components/molecules/TextComponents';
import { Button } from 'components/molecules/ButtonComponents';
import { useNavigation } from '@react-navigation/native';

export default function MyAccountScreen() {
  const { data: userDetails } = getUserFullDetails();
  const { t } = useTranslation();
  const formFields = deepCopy<MyAccountFormFieldTypes>(myAccountForm());
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const navigation = useNavigation();

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
          {updateSuccess && (
            <BlackText text={t('screens.myAccount.updateSuccess')} />
          )}
          <RTKForm
            fields={formFields}
            methodHooks={{
              PATCH: useFormUpdateUserDetailsMutation
            }}
            formType="UPDATE"
            extraFields={{ userId: userDetails.id }}
            onSubmitSuccess={() => setUpdateSuccess(true)}
            onValueChange={() => setUpdateSuccess(false)}
            formDataType="form"
          />
        </TransparentView>
        <TransparentPaddedView>
          <TransparentPaddedView>
            <Button
              title="Account Type"
              onPress={() => { (navigation.navigate as any)('EditAccountType') }}
            />
          </TransparentPaddedView>
          <TransparentPaddedView>
            <Button
              title="Phone Number"
              onPress={() => { (navigation.navigate as any)('EditPhoneNumber') }}
            />
          </TransparentPaddedView>
          <TransparentPaddedView>
            <Button
              title="Settings"
              onPress={() => { (navigation.navigate as any)('SettingsNavigator') }}
            />
          </TransparentPaddedView>
          <TransparentPaddedView>
            <Button
              title="My Family"
              onPress={() => { (navigation.navigate as any)('SettingsNavigator', { screen: "FamilySettings" }) }}
            />
          </TransparentPaddedView>
        </TransparentPaddedView>
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
