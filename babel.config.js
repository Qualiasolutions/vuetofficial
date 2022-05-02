module.exports = function (api) {
  api.cache(true);

  const rootImportOpts = {
    root: ['./'],
    alias: {
      components: './components',
      utils: './utils',
      reduxStore: './reduxStore',
      screens: './screens',
      navigation: './navigation',
      globalStyles: './globalStyles',
      assets: './assets',
      types: './types'
    }
  };

  return {
    presets: ['babel-preset-expo'],
    plugins: [['module-resolver', rootImportOpts]]
  };
};
