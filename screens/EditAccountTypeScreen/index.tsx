import { Button } from 'components/molecules/ButtonComponents';
import SafePressable from 'components/molecules/SafePressable';
import { FullPageSpinner } from 'components/molecules/Spinners';
import {
  PageSubtitle,
  PageTitle,
  PrimaryText
} from 'components/molecules/TextComponents';
import {
  TransparentPaddedView,
  TransparentView
} from 'components/molecules/ViewComponents';
import getUserFullDetails from 'hooks/useGetUserDetails';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { useUpdateUserDetailsMutation } from 'reduxStore/services/api/user';

export function EditAccountTypeScreen() {
  const { t } = useTranslation();
  const { data: userDetails } = getUserFullDetails();
  const [updateUserDetails] = useUpdateUserDetailsMutation();

  if (!userDetails) {
    return <FullPageSpinner />;
  }

  return (
    <TransparentPaddedView>
      {userDetails.is_premium ? (
        <TransparentView>
          <PageTitle
            text={`${t('screens.editAccountType.currentAccountType')}: ${t(
              'screens.editAccountType.premiumPlan'
            )}`}
          />
          <PageSubtitle text={`${t('screens.editAccountType.renewsOn')} xxx`} />
          <PageSubtitle text="..." />
          <SafePressable
            onPress={() => {
              updateUserDetails({
                user_id: userDetails.id,
                is_premium: false
              });
            }}
          >
            <PrimaryText text={t('screens.editAccountType.changePlan')} />
          </SafePressable>
        </TransparentView>
      ) : (
        <TransparentView>
          <PageTitle
            text={`${t('screens.editAccountType.currentAccountType')}: ${t(
              'screens.editAccountType.standardPlan'
            )}`}
          />
          <PageSubtitle text={t('screens.editAccountType.upgradeNow')} />
          <PageSubtitle text="..." />
          <Button
            title={t('screens.editAccountType.upgrade')}
            onPress={() => {
              updateUserDetails({
                user_id: userDetails.id,
                is_premium: true
              });
            }}
          />
        </TransparentView>
      )}
    </TransparentPaddedView>
  );
}
