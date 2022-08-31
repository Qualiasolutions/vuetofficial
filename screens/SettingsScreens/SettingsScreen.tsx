import { StyleSheet, Button } from 'react-native';

import { Text, View } from 'components/Themed';
import { blacklistTokenAsync } from 'utils/authRequests';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { logOut as logOutAction } from 'reduxStore/slices/auth/actions';

import {
  selectRefreshToken,
  selectUsername
} from 'reduxStore/slices/auth/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { SettingsTabParamList } from 'types/base';
import {
  useGetPushTokensQuery,
  useUpdatePushTokenMutation
} from 'reduxStore/services/api/notifications';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { selectPushToken } from 'reduxStore/slices/notifications/selectors';

const SettingsScreen = ({
  navigation
}: NativeStackScreenProps<SettingsTabParamList, 'Settings'>) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const jwtRefreshToken = useSelector(selectRefreshToken);
  const username = useSelector(selectUsername);
  const devicePushToken = useSelector(selectPushToken);
  const { data: userDetails } = useGetUserDetailsQuery(username, {
    skip: !username
  });
  const { data: pushTokens, isLoading: isLoadingPushTokens } =
    useGetPushTokensQuery(userDetails?.user_id || -1, {
      skip: !userDetails?.user_id
    });
  const [updatePushToken, updatePushTokenResult] = useUpdatePushTokenMutation();

  const matchingTokens = pushTokens?.filter(
    (pushToken) => pushToken.token === devicePushToken && pushToken.active
  );

  const logOut = async () => {
    if (matchingTokens) {
      for (const token of matchingTokens) {
        await updatePushToken({ id: token.id, active: false });
      }
    }
    if (jwtRefreshToken) {
      try {
        await blacklistTokenAsync(jwtRefreshToken);
      } catch (err) {
        // Silence errors and log out anyway
        console.error(err);
      }
    }
    dispatch(logOutAction());
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
