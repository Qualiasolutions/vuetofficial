import { SmallButton } from 'components/molecules/ButtonComponents';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { FullPageSpinner, PaddedSpinner } from 'components/molecules/Spinners';
import {
  TransparentPaddedView,
  TransparentView,
  WhiteBox
} from 'components/molecules/ViewComponents';
import { Text, TextInput } from 'components/Themed';
import useGetUserFullDetails from 'hooks/useGetUserDetails';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, ViewStyle } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import {
  useCreateICalIntegrationMutation,
  useDeleteICalIntegrationMutation,
  useGetICalIntegrationsQuery
} from 'reduxStore/services/api/externalCalendars';
import { ICalIntegration } from 'types/externalCalendars';

const styles = StyleSheet.create({
  form: { paddingTop: 20, marginBottom: 100 },
  buttonWrapper: { marginTop: 10, flexDirection: 'row' },
  integrationCard: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});

const IntegrationCard = ({ integration }: { integration: ICalIntegration }) => {
  const { t } = useTranslation();
  const [deleteIntegration, deleteIntegrationResult] =
    useDeleteICalIntegrationMutation();
  return (
    <WhiteBox style={styles.integrationCard}>
      <Text>{integration.ical_name}</Text>
      {deleteIntegrationResult.isLoading ? (
        <PaddedSpinner />
      ) : (
        <SmallButton
          title={t('common.delete')}
          onPress={async () => {
            await deleteIntegration(integration.id).unwrap();
          }}
          disabled={deleteIntegrationResult.isLoading}
        />
      )}
    </WhiteBox>
  );
};

const IntegrationsList = () => {
  const { t } = useTranslation();
  const { data: iCalIntegrations } = useGetICalIntegrationsQuery();

  if (!iCalIntegrations) {
    return <FullPageSpinner />;
  }

  if (iCalIntegrations.length === 0) {
    return <Text>{t('screens.integrations.noIntegrations')}</Text>;
  }
  return (
    <>
      {iCalIntegrations.map((integration) => (
        <IntegrationCard integration={integration} />
      ))}
    </>
  );
};

const IntegrationForm = ({ style }: { style?: ViewStyle }) => {
  const { t } = useTranslation();
  const [createIntegration, createIntegrationResult] =
    useCreateICalIntegrationMutation();
  const { data: user } = useGetUserFullDetails();
  const [iCalUrl, setICalUrl] = useState('');

  if (!user) {
    return (
      <TransparentView style={style}>
        <PaddedSpinner />
      </TransparentView>
    );
  }

  return (
    <TransparentView style={style}>
      <TextInput
        placeholder={t('screens.integrations.enterUrl')}
        value={iCalUrl}
        onChangeText={setICalUrl}
      />
      <TransparentView style={styles.buttonWrapper}>
        {createIntegrationResult.isLoading ? (
          <PaddedSpinner />
        ) : (
          <SmallButton
            title={t('common.submit')}
            onPress={async () => {
              try {
                await createIntegration({
                  ical_url: iCalUrl,
                  user: user.id
                }).unwrap();

                setICalUrl('');
              } catch {
                Toast.show({
                  type: 'error',
                  text1: t('common.errors.generic')
                });
              }
            }}
            disabled={!iCalUrl || createIntegrationResult.isLoading}
          />
        )}
      </TransparentView>
    </TransparentView>
  );
};

export default function IntegrationsScreen() {
  return (
    <TransparentFullPageScrollView>
      <TransparentPaddedView>
        <IntegrationsList />
        <IntegrationForm style={styles.form} />
      </TransparentPaddedView>
    </TransparentFullPageScrollView>
  );
}
