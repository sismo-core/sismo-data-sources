import "reflect-metadata";
import { AvailableDataStore, AvailableDataType } from "../../topics/attester";
import { MemoryAvailableDataStore } from "./memory-available-data";
import { LocalAvailableDataStore } from "./local-available-data";

enum TestType {
  Memory,
  Local,
}

type TestData = {
  store: AvailableDataStore;
};

const testAvailableData: { [name: string]: AvailableDataType } = {
  attester1_0: {
    attesterName: "attester1",
    timestamp: 1,
    metadata: {
      url: "https://1-0",
    },
  },
  attester1_1: {
    attesterName: "attester1",
    timestamp: 2,
    metadata: {
      url: "https://1-1",
    },
  },
  attester2_0: {
    attesterName: "attester2",
    timestamp: 3,
    metadata: {
      url: "https://2-1",
    },
  },
};

describe("test available data", () => {
  const testCases = [[TestType.Memory], [TestType.Local]];
  let testData: { [name in TestType]: TestData };

  beforeEach(() => {
    const localStore = new LocalAvailableDataStore("test-available-data");
    localStore.reset();
    testData = {
      [TestType.Memory]: {
        store: new MemoryAvailableDataStore(),
      },
      [TestType.Local]: {
        store: localStore,
      },
    };
  });

  it.each(testCases)(
    "Should generate an available data and retrieve from store",
    async (dataType) => {
      await testData[dataType].store.save(testAvailableData.attester1_0);
      const availableData = await testData[dataType].store.all();
      expect(availableData).toHaveLength(1);
      expect(availableData[0]).toEqual(testAvailableData.attester1_0);
    }
  );

  it.each(testCases)(
    "Should generate multiple available data and retrieve them from store",
    async (dataType) => {
      await testData[dataType].store.save(testAvailableData.attester1_0);
      await testData[dataType].store.save(testAvailableData.attester1_1);
      const availableData = await testData[dataType].store.all();

      expect(availableData).toHaveLength(2);
      expect(availableData[0]).toEqual(testAvailableData.attester1_0);
      expect(availableData[1]).toEqual(testAvailableData.attester1_1);
    }
  );

  it.each(testCases)(
    "Should generate multiple available data and search by name",
    async (dataType) => {
      await testData[dataType].store.save(testAvailableData.attester1_0);
      await testData[dataType].store.save(testAvailableData.attester1_1);
      await testData[dataType].store.save(testAvailableData.attester2_0);

      const attester1 = await testData[dataType].store.search({
        attesterName: testAvailableData.attester1_0.attesterName,
      });
      expect(attester1).toHaveLength(2);
      expect(attester1).toContainEqual(testAvailableData.attester1_0);
      expect(attester1).toContainEqual(testAvailableData.attester1_1);
    }
  );

  it.each(testCases)(
    "Should generate multiple available data and search by name and latest",
    async (dataType) => {
      await testData[dataType].store.save(testAvailableData.attester1_0);
      await testData[dataType].store.save(testAvailableData.attester1_1);
      await testData[dataType].store.save(testAvailableData.attester2_0);

      const latest1 = await testData[dataType].store.search({
        attesterName: testAvailableData.attester1_0.attesterName,
        latest: true,
      });
      expect(latest1[0]).toEqual(testAvailableData.attester1_1);

      const latest2 = await testData[dataType].store.search({
        attesterName: testAvailableData.attester2_0.attesterName,
        latest: true,
      });
      expect(latest2[0]).toEqual(testAvailableData.attester2_0);
    }
  );

  it.each(testCases)(
    "Should search latest in empty store and get empty array",
    async (dataType) => {
      const availableData = await testData[dataType].store.search({
        attesterName: testAvailableData.attester1_0.attesterName,
        latest: true,
      });
      expect(availableData).toHaveLength(0);
    }
  );
});
