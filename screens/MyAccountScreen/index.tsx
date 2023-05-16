import { useTranslation } from 'react-i18next';

import { TransparentPaddedView } from 'components/molecules/ViewComponents';
import { StyleSheet } from 'react-native';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { Button } from 'components/molecules/ButtonComponents';
import { useNavigation } from '@react-navigation/native';

export default function MyAccountScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation()
  return (
    <TransparentFullPageScrollView>
      <TransparentPaddedView>
        <TransparentPaddedView>
          <Button
            title="Account Details"
            onPress={() => { (navigation.navigate as any)('EditAccountDetails') }}
          />
        </TransparentPaddedView>
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
            title="Security"
            onPress={() => { (navigation.navigate as any)('EditSecurity') }}
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

const styles = StyleSheet.create({
  formContainer: {
    marginBottom: 20
  }
});
