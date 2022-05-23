import Constants from 'expo-constants';
const vuetApiUrl = Constants.manifest?.extra?.vuetApiUrl;

export const makeApiUrl = (path: string): string => {
  const apiUrl = `http://${vuetApiUrl}${path}`;
  const trailingSlash = apiUrl.slice(-1) === '/' ? '' : '/';
  return `http://${vuetApiUrl}${path}${trailingSlash}`;
};
