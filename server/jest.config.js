export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: [ '.ts' ],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [ 'ts-jest', {
      useESM: true,
      tsconfig: {
        module: 'ESNext',
        target: 'ES2022',
        moduleResolution: 'node',
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
      }
    } ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(hono|@jest/globals)/)'
  ],
  testMatch: [
    '**/src/tests/**/*.test.ts',
    '**/src/**/*.test.ts'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/tests/**',
    '!src/**/*.test.ts',
    '!src/index.ts'
  ],
  setupFilesAfterEnv: [ '<rootDir>/src/tests/setup.ts' ],
  testTimeout: 10000,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
}; 