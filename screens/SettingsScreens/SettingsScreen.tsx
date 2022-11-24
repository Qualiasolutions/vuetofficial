import { StyleSheet } from 'react-native';
import { Button } from 'components/molecules/ButtonComponents';

import { Text, View } from 'components/Themed';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTranslation } from 'react-i18next';
import { SettingsTabParamList } from 'types/base';

const SettingsScreen = ({
  navigation
}: NativeStackScreenProps<SettingsTabParamList, 'Settings'>) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('screens.settings.title')}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%'
  },
  familySettingsButton: {
    marginBottom: 10
  }
});

export default SettingsScreen;
