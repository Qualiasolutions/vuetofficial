import { StyleSheet, Button } from 'react-native';

import { Text, View } from '../components/Themed';
import { blacklistTokenAsync } from '../utils/authRequests';

import { setAccessToken, setRefreshToken, setUsername } from '../reduxStore/slices/auth/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { RootStackScreenProps, RootTabScreenProps } from '../types/base';
import type { Dispatch } from '@reduxjs/toolkit';
import { EntireState } from '../reduxStore/types';
import { AuthReducerActionType } from '../reduxStore/slices/auth/types';

interface SettingsProps extends RootTabScreenProps<'Settings'> {
  setAccessTokenProp: Function;
  setRefreshTokenProp: Function;
  setUsernameProp: Function;
  jwtRefreshToken: string;
}

const SettingsScreen = ({
  navigation,
  setAccessTokenProp,
  setRefreshTokenProp,
  setUsernameProp,
  jwtRefreshToken
}: SettingsProps) => {
  const logOut = () => {
    blacklistTokenAsync(jwtRefreshToken).then(() => {
      setAccessTokenProp('');
      setRefreshTokenProp('');
      setUsernameProp('');
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View>
        <Button title="Log Out" onPress={logOut} />
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

const mapStateToProps = (state: EntireState) => ({
  jwtRefreshToken: state.authentication.jwtRefreshToken,
  username: state.authentication.username
});

const mapDispatchToProps = (dispatch: Dispatch<AuthReducerActionType>) => {
  return bindActionCreators(
    {
      setAccessTokenProp: setAccessToken,
      setRefreshTokenProp: setRefreshToken,
      setUsernameProp: setUsername
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
