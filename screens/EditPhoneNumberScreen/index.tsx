import { TransparentFullPageScrollView } from "components/molecules/ScrollViewComponents";
import { TransparentView, TransparentPaddedView } from "components/molecules/ViewComponents";
import { Text } from "components/Themed";
import { useTranslation } from "react-i18next";
import getUserFullDetails from 'hooks/useGetUserDetails';
import { FullPageSpinner } from "components/molecules/Spinners";
import PhoneNumberInput from "components/forms/components/PhoneNumberInput";
import { useState } from "react";
import { Button } from "components/molecules/ButtonComponents";
import { useCreatePhoneValidationMutation } from "reduxStore/services/api/signup";
import { useUpdateUserDetailsMutation } from "reduxStore/services/api/user";
import _ from "lodash";
import { isInvalidPhoneNumberError } from "types/signup";
import Toast from 'react-native-toast-message';

export function EditPhoneNumberScreen() {
  const { t } = useTranslation()
  const { data: userDetails } = getUserFullDetails();
  const [newPhone, setNewPhone] = useState("")
  const [updateUserDetails, updateUserDetailsResult] = useUpdateUserDetailsMutation();

  if (!userDetails) {
    return <FullPageSpinner />
  }

  console.log("userDetails")
  console.log(userDetails)
  console.log(userDetails["phone_number"])
  console.log(newPhone)

  return <TransparentFullPageScrollView>
    <TransparentPaddedView>
      <TransparentView style={{ marginBottom: 20 }}>
        <Text>
          {t("screens.editPhoneNumber.currentPhone")}
        </Text>
        <Text style={{ fontWeight: "bold" }}>{userDetails.phone_number}</Text>
      </TransparentView>
      <Text style={{ marginBottom: 20 }}>{t("screens.editPhoneNumber.enterNew")}</Text>
      <PhoneNumberInput
        onChangeFormattedText={setNewPhone}
        containerStyle={{ flex: 1, height: 50 }}
        textInputStyle={{
          height: 50
        }}
      />
      <Button
        title={t("common.update")}
        onPress={async () => {
          await updateUserDetails({
            user_id: userDetails.id,
            phone_number: newPhone,
            username: newPhone,
          }).unwrap()
            .then((res) => {
              Toast.show({
                type: 'success',
                text1: t('screens.editPhoneNumber.updateSuccess')
              });
            })
            .catch((err) => {
              if (isInvalidPhoneNumberError(err)) {
                Toast.show({
                  type: 'error',
                  text1: t('screens.editPhoneNumber.invalidPhone')
                });
              }
            })
        }}
        disabled={newPhone.length < 9}
        style={{
          marginTop: 20
        }}
      />
    </TransparentPaddedView>
  </TransparentFullPageScrollView>
}