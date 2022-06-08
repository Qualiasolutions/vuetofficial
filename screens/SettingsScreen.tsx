import { StyleSheet, Button } from 'react-native';

import { Text, View } from '../components/Themed';
import { blacklistTokenAsync } from '../utils/authRequests';

import {
  setAccessToken,
  setRefreshToken,
  setUsername
} from '../reduxStore/slices/auth/actions';

import { selectRefreshToken } from '../reduxStore/slices/auth/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';


const SettingsScreen = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const jwtRefreshToken = useSelector(selectRefreshToken);

  const logOut = () => {
    blacklistTokenAsync(jwtRefreshToken).then(() => {
      dispatch(setAccessToken(''));
      dispatch(setRefreshToken(''));
      dispatch(setUsername(''));
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("screens.settings.title")}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View>
        <Button title={t("screens.settings.logOutText")} onPress={logOut} />
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
