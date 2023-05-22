import { StyleSheet } from 'react-native';
import { Button } from 'components/molecules/ButtonComponents';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTranslation } from 'react-i18next';
import { SettingsTabParamList } from 'types/base';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { TransparentView } from 'components/molecules/ViewComponents';

const SettingsScreen = ({
  navigation
}: NativeStackScreenProps<SettingsTabParamList, 'Settings'>) => {
  const { t } = useTranslation();

  return (
    <TransparentFullPageScrollView contentContainerStyle={styles.container}>
      <TransparentView>
        <Button
          title="FAMILY SETTINGS"
          onPress={() => {
            navigation.navigate('FamilySettings');
          }}
          style={styles.familySettingsButton}
        />
        <Button
          title="FRIEND SETTINGS"
          onPress={() => {
            navigation.navigate('FriendSettings');
          }}
        />
      </TransparentView>
    </TransparentFullPageScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  familySettingsButton: {
    marginBottom: 10
  }
});

export default SettingsScreen;
