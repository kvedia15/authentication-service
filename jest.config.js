module.exports = {
  preset: "ts-jest", // use ts-jest preset
  testEnvironment: "node", // use node environment
  roots: ["<rootDir>/tests"], // look for tests in tests folder
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", // use ts-jest for .ts and .tsx files
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx)?$", 
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
