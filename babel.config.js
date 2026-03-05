module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // babel-preset-expo auto-includes react-native-reanimated/plugin when detected
      'babel-preset-expo',
      // NativeWind v4: exports a preset config ({plugins:[...]}) — must live in presets, not plugins
      'nativewind/babel',
    ],
  };
};
