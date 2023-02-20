module.exports = {
  roots: ["<rootDir>"],
  verbose: true,
  extensionsToTreatAsEsm: ['.ts'],
  modulePathIgnorePatterns: ["<rootDir>/node_modules", "<rootDir>/dist"],
  moduleFileExtensions: ["ts", "js", "json"],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testRegex: ".*\\.(Test|test)\\.ts$",
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true
      }
    ],
  }
};