module.exports = {
  preset: "ts-jest",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$",
  moduleNameMapper: {
    "@valkyr/(.*)": "<rootDir>/packages/$1/src"
  },
  verbose: true,
  clearMocks: true,
  testTimeout: 180000,
  "testPathIgnorePatterns" : [
    "<rootDir>/playground/",
    "<rootDir>/website/"
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/playground/",
    "/website/",
    ".*/tests/.*"
  ]
}