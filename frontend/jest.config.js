module.exports = {
    preset: 'ts-jest', // Use the ts-jest preset to transform TypeScript files
    testEnvironment: 'jest-environment-jsdom', // Use jsdom as the test environment
    setupFilesAfterEnv: ['@testing-library/jest-dom'], // Import jest-dom matchers
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json', // Use your TypeScript config
      },
    },
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',  // Transform TypeScript files with ts-jest
    },
    testMatch: ['**/?(*.)+(spec|test).ts?(x)'], // Look for .ts and .tsx test files
  };
  