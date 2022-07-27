export default {
  preset: "ts-jest",
  setupFilesAfterEnv: ["./jest.setup.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/build/"],
  collectCoverageFrom: ["src/**/*.ts", "attesters/hydra-s1/**/*.ts"],
};
