import "reflect-metadata";
import { DependencyContainer } from "tsyringe";
import { getMemoryContainer } from "../../infrastructure";
import { TestAttester } from "./test-attester";
import { Attester, AvailableDataStore } from "./";

describe("Test attester", () => {
  let container: DependencyContainer;
  let baseAttester: Attester;
  let testAttester: TestAttester;

  beforeEach(async () => {
    container = getMemoryContainer();
    baseAttester = container.resolve(Attester);
    testAttester = container.resolve(TestAttester);
  });

  it("should call compute method on base class and throw an error", async () => {
    await expect(async () => {
      await baseAttester.compute();
    }).rejects.toThrow();
  });

  it("should call sendOnChain method on base class and throw an error", async () => {
    await expect(async () => {
      await baseAttester.sendOnChain();
    }).rejects.toThrow();
  });

  it("should fetch groups with internal collection id", async () => {
    const groupsWithId = [];
    for await (const groupWithId of testAttester.fetchGroups()) {
      groupsWithId.push(groupWithId);
    }
    expect(groupsWithId).toHaveLength(3);

    expect(groupsWithId[0].internalCollectionId).toBe(0);
    expect(groupsWithId[0].group.name).toBe("test-group");
    expect(groupsWithId[0].group.timestamp).toBe(1);

    expect(groupsWithId[1].internalCollectionId).toBe(0);
    expect(groupsWithId[1].group.name).toBe("test-group");
    expect(groupsWithId[1].group.timestamp).toBe(2);

    expect(groupsWithId[2].internalCollectionId).toBe(1);
    expect(groupsWithId[2].group.name).toBe("test-group2");
    expect(groupsWithId[2].group.timestamp).toBe(3);
  });

  it("should make groups available and save available data", async () => {
    await testAttester.compute();
    const availableDataStore =
      container.resolve<AvailableDataStore>("AvailableDataStore");
    const availableData = await availableDataStore.all();
    expect(availableData).toHaveLength(1);
    expect(availableData[0].attesterName).toBe(testAttester.name);
    expect(availableData[0].metadata.url).toBe(
      "https://fake-available-data-url/"
    );
  });
});
