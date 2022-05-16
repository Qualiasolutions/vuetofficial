import Constants from 'expo-constants';
const vuetApiUrl = Constants.manifest?.extra?.vuetApiUrl;

export const makeApiUrl = (path: string): string => {
  return `http://${vuetApiUrl}${path}`;
};
