module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // NativeWind (Tailwind for React Native) — must come before reanimated
      'nativewind/babel',
      // react-native-reanimated — must be listed last
      'react-native-reanimated/plugin',
    ],
  };
};
