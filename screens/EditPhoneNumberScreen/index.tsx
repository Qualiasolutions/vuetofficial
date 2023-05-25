import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import {
  TransparentView,
  TransparentPaddedView
} from 'components/molecules/ViewComponents';
import { Text } from 'components/Themed';
import { useTranslation } from 'react-i18next';
import getUserFullDetails from 'hooks/useGetUserDetails';
import { FullPageSpinner } from 'components/molecules/Spinners';
import PhoneNumberInput from 'components/forms/components/PhoneNumberInput';
import { useState } from 'react';
import { Button } from 'components/molecules/ButtonComponents';
import { useCreatePhoneValidationMutation } from 'reduxStore/services/api/signup';
import { useUpdateUserDetailsMutation } from 'reduxStore/services/api/user';
import {
  isFieldErrorCodeError,
  isInvalidPhoneNumberError,
  isTakenPhoneNumberError
} from 'types/signup';
import Toast from 'react-native-toast-message';
import ValidationCodeInput from 'components/molecules/ValidationCodeInput';

export function EditPhoneNumberScreen() {
  const { t } = useTranslation();
  const { data: userDetails } = getUserFullDetails();
  const [newPhone, setNewPhone] = useState('');
  const [validationId, setValidationId] = useState<number | null>(null);
  const [updateUserDetails, updateUserDetailsResult] =
    useUpdateUserDetailsMutation();
  const [createPhoneValidation, createPhoneValidationResult] =
    useCreatePhoneValidationMutation();

  if (!userDetails) {
    return <FullPageSpinner />;
  }

  if (validationId) {
    return (
      <TransparentFullPageScrollView>
        <TransparentPaddedView>
          <ValidationCodeInput
            validationId={validationId}
            phoneNumber={newPhone}
            onSuccess={() => {
              updateUserDetails({
                user_id: userDetails.id,
                phone_number: newPhone
              })
                .unwrap()
                .then(() => {
                  Toast.show({
                    type: 'success',
                    text1: t('screens.editPhoneNumber.updateSuccess')
                  });
                  setValidationId(null);
                  setNewPhone('');
                })
                .catch((err) => {
                  Toast.show({
                    type: 'error',
                    text1: t('screens.validatePhone.invalidCodeError')
                  });
                });
            }}
            onError={(err) => {
              if (isFieldErrorCodeError('code', 'invalid_code')(err)) {
                Toast.show({
                  type: 'error',
                  text1: t('screens.validatePhone.invalidCodeError')
                });
              } else {
                Toast.show({
                  type: 'error',
                  text1: t('common.errors.generic')
                });
              }
            }}
          />
        </TransparentPaddedView>
      </TransparentFullPageScrollView>
    );
  }

  return (
    <TransparentFullPageScrollView>
      <TransparentPaddedView>
        <TransparentView style={{ marginBottom: 20 }}>
          <Text>{t('screens.editPhoneNumber.currentPhone')}</Text>
          <Text style={{ fontWeight: 'bold' }}>{userDetails.phone_number}</Text>
        </TransparentView>
        <Text style={{ marginBottom: 20 }}>
          {t('screens.editPhoneNumber.enterNew')}
        </Text>
        <PhoneNumberInput
          onChangeFormattedText={setNewPhone}
          containerStyle={{ flex: 1 }}
        />
        <Button
          title={t('common.update')}
          onPress={async () => {
            await createPhoneValidation({
              phone_number: newPhone
            })
              .unwrap()
              .then((res) => {
                setValidationId(res.id);
              })
              .catch((err) => {
                if (isInvalidPhoneNumberError(err)) {
                  Toast.show({
                    type: 'error',
                    text1: t('screens.editPhoneNumber.invalidPhone')
                  });
                } else if (isTakenPhoneNumberError(err)) {
                  Toast.show({
                    type: 'error',
                    text1: t('screens.editPhoneNumber.takenPhone')
                  });
                } else {
                  Toast.show({
                    type: 'error',
                    text1: t('common.errors.generic')
                  });
                }
              });
          }}
          disabled={newPhone.length < 9}
          style={{
            marginTop: 20
          }}
        />
      </TransparentPaddedView>
    </TransparentFullPageScrollView>
  );
}
