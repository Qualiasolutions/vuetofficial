import { StyleSheet, Button } from 'react-native';

import { Text, View } from 'components/Themed';
import { blacklistTokenAsync } from 'utils/authRequests';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { logOut as logOutAction } from 'reduxStore/slices/auth/actions';

import { selectRefreshToken } from 'reduxStore/slices/auth/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { SettingsTabParamList } from 'types/base';

const SettingsScreen = ({
  navigation
}: NativeStackScreenProps<SettingsTabParamList, 'Settings'>) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const jwtRefreshToken = useSelector(selectRefreshToken);

  const logOut = () => {
    blacklistTokenAsync(jwtRefreshToken)
      .then(() => {
        dispatch(logOutAction());
      })
      .catch(() => {
        // Ignore errors and logout the frontend anyway
        dispatch(logOutAction());
      });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('screens.settings.title')}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View>
        <Button title={t('screens.settings.logOutText')} onPress={logOut} />
        <Button
          title="FAMILY SETTINGS"
          onPress={() => {
            navigation.navigate('FamilySettings');
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
    fontSize: 20,
    fontWeight: 'bold'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%'
  }
});

export default SettingsScreen;
