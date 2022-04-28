module.exports = function (api) {
  api.cache(true);

  const rootImportOpts = {
    root: ['./'],
    alias: {
      components: './components'
    }
  };

  return {
    presets: ['babel-preset-expo'],
    plugins: [['module-resolver', rootImportOpts]]
  };
};
