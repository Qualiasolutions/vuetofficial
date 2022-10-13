const extraData = {
  vuetApiUrl: process.env.REACT_NATIVE_PACKAGER_HOSTNAME
    ? `${process.env.REACT_NATIVE_PACKAGER_HOSTNAME.trim()}:8000`
    : process.env.ENV === 'LOCAL'
    ? 'localhost:8000'
    : 'api.vuet.app',
  processEnv: process.env.ENV
};

export default {
  expo: {
    name: 'vuet-app',
    slug: 'vuet-app',
    version: '1.0.0',
    orientation: 'portrait',
    owner: 'vuet',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff'
      }
    },
    web: {
      favicon: './assets/images/favicon.png'
    },
    extra: extraData
  }
};
