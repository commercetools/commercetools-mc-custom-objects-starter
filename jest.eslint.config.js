module.exports = {
  runner: 'jest-runner-eslint',
  displayName: 'eslint',
  modulePathIgnorePatterns: ['dist', 'coverage', 'public'],
  moduleFileExtensions: ['js'],
  testMatch: ['<rootDir>/**/*.js'],
  watchPlugins: ['jest-plugin-filename'],
};
