module.exports = {
  preset: "ts-jest",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$",
  moduleNameMapper: {
    "@valkyr/(.*)": "<rootDir>/packages/$1/src"
  },
  verbose: true,
  clearMocks: true,
  testTimeout: 180000,
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/website/",
    ".*/tests/.*"
  ]
}