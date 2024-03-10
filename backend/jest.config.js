/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
    '@/db': '<rootDir>/src/db',
    '@/config': '<rootDir>/src/config',
    '@/exceptions': '<rootDir>/src/exceptions',
    '@/(.*)': '<rootDir>/src/$1',
  }
};