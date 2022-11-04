module.exports = {
  preset: "ts-jest",
  roots: ["<rootDir>"],
  verbose: true,
  modulePathIgnorePatterns: ["<rootDir>/node_modules", "<rootDir>/dist"],
  moduleFileExtensions: ["ts", "js", "json"],
  testRegex: ".*\\.(test)\\.ts$",
  transform: {
    "^.+\\.ts$": "ts-jest",
  }
};