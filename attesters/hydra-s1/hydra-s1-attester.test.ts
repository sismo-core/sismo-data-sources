import "reflect-metadata";
import { DependencyContainer, injectable } from "tsyringe";
import { getMemoryContainer } from "../../src/infrastructure";
import { Group, ValueType } from "../../src/topics/group";
import { AttestationsCollection } from "../../src/topics/attestations-collection";
import { Badge } from "../../src/topics/badge";
import { MemoryFileStore } from "../../src/infrastructure/file-store";
import { MemoryAvailableDataStore } from "../../src/infrastructure/available-data";
import { HydraS1Attester } from "./hydra-s1-attester";

@injectable()
export class TestHydraAttester extends HydraS1Attester {
  name = "test-attester";
  collectionIdFirst = 1000;
  attestationsCollections = [
    new AttestationsCollection({
      internalCollectionId: 0,
      groupFetcher: async () => [
        new Group(this.groupStore, {
          name: "test-group",
          timestamp: 1,
          data: { "0x1": 1, "0x2": 1 },
          tags: [],
          valueType: ValueType.Info,
        }),
        new Group(this.groupStore, {
          name: "test-group",
          timestamp: 2,
          data: { "0x3": 1, "0x4": 1 },
          tags: [],
          valueType: ValueType.Info,
        }),
      ],
      badge: new Badge({
        name: "Test Badge",
        description: "Test Badge",
        image: "./badges/test.svg",
        requirements: [],
      }),
    }),
  ];
}

const parseMemoryUrl = (url: string) => url.substring(9);

describe("Test HydraS1 attester", () => {
  let container: DependencyContainer;
  let testAttester: TestHydraAttester;

  beforeEach(async () => {
    container = getMemoryContainer();
    testAttester = container.resolve(TestHydraAttester);
  });

  it("should generate available groups", async () => {
    await testAttester.compute();
    const availableGroupStore = container.resolve<MemoryFileStore>(
      "AvailableGroupStore"
    );
    const availableData = await container
      .resolve<MemoryAvailableDataStore>("AvailableDataStore")
      .all();

    expect(availableData).toHaveLength(1);
    const availableGroup = await availableGroupStore.read(
      parseMemoryUrl(availableData[0].metadata.url)
    );
    expect(Object.keys(availableGroup)).toContain("registryTree");
    expect(availableGroup.registryTree.metadata.leavesCount).toBe(2);

    expect(Object.keys(availableGroup)).toContain("accountTrees");
    expect(availableGroup.accountTrees).toHaveLength(2);
  });
});
