module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'react'],
  extends: [
    '@react-native-community',
    'airbnb-typescript',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react'
  ],
  rules: {
    'no-console': 1, // Means warning
    'prettier/prettier': 2, // Means error
    indent: ['error', 2]
  }
};
