import "reflect-metadata";
import { DependencyContainer } from "tsyringe";
import { Group, GroupStore } from "../../topics/group";
import { createTestGroups, exampleData } from "../../topics/group/test-groups";
import { getLocalContainer, getMemoryContainer } from "../container";
import { LocalGroupStore } from "./local-group-store";

enum TestType {
  Local,
  Memory,
}

type TestData = {
  container: DependencyContainer;
  groups: { [name: string]: Group };
  groupStore: GroupStore;
  validUrlPrefix: string;
};

describe("test groups stores", () => {
  const testCases = [[TestType.Local], [TestType.Memory]];
  let testData: { [name in TestType]: TestData };

  beforeEach(() => {
    const localContainer = getLocalContainer().createChildContainer();
    const localGroupStore = new LocalGroupStore("tests-group-store");
    localGroupStore.reset();
    localContainer.register<GroupStore>("GroupStore", {
      useValue: localGroupStore,
    });
    const memoryContainer = getMemoryContainer();
    testData = {
      [TestType.Local]: {
        container: localContainer,
        groups: createTestGroups(localContainer),
        groupStore: localContainer.resolve("GroupStore"),
        validUrlPrefix: "file:///",
      },
      [TestType.Memory]: {
        container: memoryContainer,
        groups: createTestGroups(memoryContainer),
        groupStore: memoryContainer.resolve("GroupStore"),
        validUrlPrefix: "memory://",
      },
    };
  });

  it.each(testCases)(
    "Should generate a group and retrieve from store",
    async (dataType) => {
      await testData[dataType].groups.group1_0.save();
      const groups = await testData[dataType].groupStore.all();
      expect(groups).toHaveLength(1);
      expect(groups[0].json).toEqual(testData[dataType]?.groups.group1_0.json);
    }
  );

  it.each(testCases)(
    "Should generate multiple groups and retrieve them from store",
    async (dataType) => {
      await testData[dataType].groups.group1_0.save();
      await testData[dataType].groups.group1_1.save();
      const groups = (await testData[dataType].groupStore.all()).map(
        (group) => group.json
      );
      expect(groups).toHaveLength(2);
      expect(groups).toContainEqual(testData[dataType].groups.group1_0.json);
      expect(groups).toContainEqual(testData[dataType].groups.group1_1.json);
    }
  );

  it.each(testCases)(
    "Should generate multiple groups and retrieve latest",
    async (dataType) => {
      await testData[dataType].groups.group1_1.save();
      await testData[dataType].groups.group1_0.save();
      const latest = await testData[dataType].groupStore.latest(
        testData[dataType].groups.group1_0.name
      );
      expect(latest.json).toEqual(testData[dataType].groups.group1_1.json);
    }
  );

  it.each(testCases)(
    "Should generate multiple groups and search by name",
    async (dataType) => {
      await testData[dataType].groups.group1_0.save();
      await testData[dataType].groups.group1_1.save();
      await testData[dataType].groups.group2_0.save();

      const groups1 = (
        await testData[dataType].groupStore.search({
          groupName: testData[dataType].groups.group1_0.name,
        })
      ).map((group) => group.json);
      expect(groups1).toHaveLength(2);
      expect(groups1).toContainEqual(testData[dataType].groups.group1_0.json);
      expect(groups1).toContainEqual(testData[dataType].groups.group1_1.json);
    }
  );

  it.each(testCases)(
    "Should generate multiple groups and search by name and latest",
    async (dataType) => {
      await testData[dataType].groups.group1_0.save();
      await testData[dataType].groups.group1_1.save();
      await testData[dataType].groups.group2_0.save();

      const latest1 = await testData[dataType].groupStore.search({
        groupName: testData[dataType].groups.group1_0.name,
        latest: true,
      });
      expect(latest1[0].json).toEqual(testData[dataType].groups.group1_1.json);

      const latest2 = await testData[dataType].groupStore.search({
        groupName: testData[dataType].groups.group2_0.name,
        latest: true,
      });
      expect(latest2[0].json).toEqual(testData[dataType].groups.group2_0.json);
    }
  );

  it.each(testCases)(
    "Should generate multiple groups and get latests",
    async (dataType) => {
      await testData[dataType].groups.group1_0.save();
      await testData[dataType].groups.group1_1.save();
      await testData[dataType].groups.group2_0.save();

      const latests = await testData[dataType].groupStore.latests();
      expect(Object.keys(latests)).toHaveLength(2);
      expect(latests[testData[dataType].groups.group1_0.name].json).toEqual(
        testData[dataType].groups.group1_1.json
      );
      expect(latests[testData[dataType].groups.group2_0.name].json).toEqual(
        testData[dataType].groups.group2_0.json
      );
    }
  );

  it.each(testCases)(
    "Should throw error when retrieving latest from empty store",
    async (dataType) => {
      await expect(async () => {
        await testData[dataType].groupStore.latest(
          testData[dataType].groups.group1_0.name
        );
      }).rejects.toThrow();
    }
  );

  it.each(testCases)(
    "Should generate a group and retrieve data locally",
    async (dataType) => {
      expect(await testData[dataType].groups.group1_0.data()).toEqual(
        exampleData
      );
    }
  );

  it.each(testCases)(
    "Should generate a group and retrieve data from store",
    async (dataType) => {
      await testData[dataType].groups.group1_0.save();
      const group = await testData[dataType].groupStore.latest(
        testData[dataType].groups.group1_0.name
      );
      expect(await group.data()).toEqual(exampleData);
    }
  );

  it.each(testCases)(
    "Should get not empty dataUrl from group",
    async (dataType) => {
      await testData[dataType].groups.group1_0.save();
      expect(testData[dataType].groups.group1_0.dataUrl).toBeTruthy();
      const group = await testData[dataType].groupStore.latest(
        testData[dataType].groups.group1_0.name
      );
      expect(await group.data()).toEqual(exampleData);
    }
  );

  it.each(testCases)("Should get valid url prefix", async (dataType) => {
    expect(
      testData[dataType].groups.group1_0.dataUrl.startsWith(
        testData[dataType].validUrlPrefix
      )
    ).toBeTruthy();
  });
});
