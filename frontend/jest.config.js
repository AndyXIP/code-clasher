module.exports = {
  preset: 'ts-jest', // Use ts-jest to transform TypeScript files
  testEnvironment: 'jest-environment-jsdom', // Use jsdom as the test environment for React
  setupFilesAfterEnv: ['@testing-library/jest-dom'], // Setup jest-dom for extended matchers
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json', // Reference your TypeScript configuration
    },
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',  // Ensure ts-jest transforms .ts and .tsx files
  },
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'], // Ensure Jest picks up test files correctly
};
