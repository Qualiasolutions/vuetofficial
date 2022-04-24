import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

import { Text, View } from '../components/Themed';

const vuetApiUrl = Constants.manifest?.extra?.vuetApiUrl

type LoginResponse = {
  access: string;
  refresh: string;
}

const getTokenAsync = async (username: string, password: string) => {
  return await fetch(`http://${vuetApiUrl}/auth/token/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })
    .then((response) => response.json())
    .then((data) => data.token)
    .catch((err) => {
      console.log(err);
    });
};

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login: {Constants.manifest?.extra?.vuetApiUrl} </Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
