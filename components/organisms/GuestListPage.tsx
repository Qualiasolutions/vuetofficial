import PhoneNumberInput from 'components/forms/components/PhoneNumberInput';
import { Button, SmallButton } from 'components/molecules/ButtonComponents';
import PhoneOrEmailInput from 'components/molecules/PhoneOrEmailInput';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { FullPageSpinner, PaddedSpinner } from 'components/molecules/Spinners';
import { PrimaryText } from 'components/molecules/TextComponents';
import { TouchableOpacity } from 'components/molecules/TouchableOpacityComponents';
import {
  TransparentPaddedView,
  TransparentView,
  WhitePaddedView
} from 'components/molecules/ViewComponents';
import { Text, TextInput } from 'components/Themed';
import { validate } from 'email-validator';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import {
  useCreateGuestListInviteMutation,
  useGetGuestListInvitesQuery
} from 'reduxStore/services/api/guestListInvites';
import { CreateGuestListInviteRequest } from 'types/guestListInvites';

const styles = StyleSheet.create({
  buttonWrapper: {
    marginTop: 20
  }
});

const GuestListInviter = ({ entityId }: { entityId: number }) => {
  const { t } = useTranslation();
  const [createInvite, createInviteResult] = useCreateGuestListInviteMutation();
  const [usingEmail, setUsingEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <TransparentPaddedView>
      <PhoneOrEmailInput
        usingEmail={usingEmail}
        value={usingEmail ? email : phoneNumber}
        changeUsingEmail={setUsingEmail}
        onValueChange={(val) => {
          if (usingEmail) {
            setEmail(val);
          } else {
            setPhoneNumber(val);
          }
        }}
      />
      <TransparentView style={styles.buttonWrapper}>
        {createInviteResult.isLoading ? (
          <PaddedSpinner />
        ) : (
          <SmallButton
            onPress={async () => {
              const body: CreateGuestListInviteRequest = {
                entity: entityId
              };
              if (usingEmail) {
                body.email = email;
              } else {
                body.phone_number = phoneNumber;
              }
              await createInvite(body);
            }}
            title={t('common.invite')}
            disabled={
              (usingEmail && !validate(email)) ||
              (!usingEmail && phoneNumber.length < 9)
            }
          />
        )}
      </TransparentView>
    </TransparentPaddedView>
  );
};

export default function GuestListPage({ entityId }: { entityId: number }) {
  const { t } = useTranslation();
  const { isLoading: isLoadingInvites, data: invites } =
    useGetGuestListInvitesQuery();

  if (!invites || isLoadingInvites) {
    return <FullPageSpinner />;
  }

  return (
    <WhiteFullPageScrollView>
      <WhitePaddedView>
        {invites.map((invite) => (
          <TransparentPaddedView>
            <Text>{invite.email || invite.phone_number}</Text>
          </TransparentPaddedView>
        ))}
      </WhitePaddedView>
      <GuestListInviter entityId={entityId} />
    </WhiteFullPageScrollView>
  );
}
