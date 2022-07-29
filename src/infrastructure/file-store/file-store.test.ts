import FileStore from "../../file-store";
import { LocalFileStore, MemoryFileStore } from "./";

enum TestType {
  Local,
  Memory,
}

type TestData = {
  store: FileStore;
};

describe("test file store", () => {
  const localFileStore = new LocalFileStore("tests-file-store");
  const testCases = [[TestType.Local], [TestType.Memory]];
  let testData: { [name in TestType]: TestData };

  beforeEach(async () => {
    localFileStore.reset();
    testData = {
      [TestType.Local]: { store: localFileStore },
      [TestType.Memory]: { store: new MemoryFileStore("") },
    };
  });

  it.each(testCases)("Should store a file and retrieve", async (dataType) => {
    await testData[dataType].store.write("test_file", "test_data");
    expect(await testData[dataType].store.read("test_file")).toBe("test_data");
  });

  it.each(testCases)(
    "Should return true for existing file",
    async (dataType) => {
      await testData[dataType].store.write("test_file", "test_data");
      expect(await testData[dataType].store.exists("test_file")).toBeTruthy();
    }
  );

  it.each(testCases)(
    "Should return false for not existing file",
    async (dataType) => {
      expect(await testData[dataType].store.exists("test_file")).toBeFalsy();
    }
  );

  it.each(testCases)(
    "Should throw an error while reading not existing file",
    async (dataType) => {
      await expect(async () => {
        await testData[dataType].store.read("not_existing_file");
      }).rejects.toThrow();
    }
  );
});
