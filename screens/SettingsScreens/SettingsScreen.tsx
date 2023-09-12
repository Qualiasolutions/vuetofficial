import { StyleSheet } from 'react-native';
import { Button } from 'components/molecules/ButtonComponents';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTranslation } from 'react-i18next';
import { SettingsTabParamList } from 'types/base';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { TransparentView } from 'components/molecules/ViewComponents';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  button: {
    marginBottom: 10
  }
});

const SettingsScreen = ({
  navigation
}: NativeStackScreenProps<SettingsTabParamList, 'Settings'>) => {
  const { t } = useTranslation();

  return (
    <TransparentFullPageScrollView contentContainerStyle={styles.container}>
      <TransparentView>
        <Button
          title={t('pageTitles.familySettings')}
          onPress={() => {
            navigation.navigate('FamilySettings');
          }}
          style={styles.button}
        />
        <Button
          title={t('pageTitles.personalAssistant')}
          onPress={() => {
            navigation.navigate('PersonalAssistant');
          }}
          style={styles.button}
        />
        <Button
          title={t('pageTitles.routines')}
          onPress={() => {
            navigation.navigate('Routines');
          }}
          style={styles.button}
        />
      </TransparentView>
    </TransparentFullPageScrollView>
  );
};

export default SettingsScreen;
