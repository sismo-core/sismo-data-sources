import "reflect-metadata";
import { getMemoryContainer } from "../../src/infrastructure";
import { Group, ValueType } from "../../src/topics/group";
import { MemoryFileStore } from "../../src/infrastructure/file-store";
import { HydraS1AvailableGroup } from "./available-group";
import { MerkleTreeHandler } from "./helpers";

describe("Test HydraS1 available group", () => {
  let testGroup: Group;
  let availableGroup: HydraS1AvailableGroup;
  let fileStore: MemoryFileStore;

  beforeEach(async () => {
    const container = getMemoryContainer();
    testGroup = Group.create(container, {
      name: "test-group",
      timestamp: 1,
      data: { "0x1": 1, "0x2": 1 },
      tags: [],
      valueType: ValueType.Info,
    });
    fileStore = new MemoryFileStore("");
    availableGroup = new HydraS1AvailableGroup(fileStore, {
      group: testGroup,
      internalCollectionId: 0,
    });
  });

  it("should create an available group and ger correct properties and id", async () => {
    expect(availableGroup.properties.internalCollectionId).toBe(0);
    expect(availableGroup.properties.generationTimestamp).toBe(
      testGroup.timestamp
    );
    expect(availableGroup.properties.isScore).toBe(false);
    expect(availableGroup.id).toBe(
      "0x19ad9a600c5c070a445a086172bfd73e752e0d7ba85ec5edf6474585cfcdbd56"
    );
  });

  it("should generate an available data and verify data", async () => {
    const availableData = await availableGroup.compute();
    expect(availableData).toHaveLength(1);
    const dataFileName = availableData[0].dataUrl.substring(9); // url starts with "memory://"
    expect(await fileStore.read(dataFileName)).toEqual(await testGroup.data());
    const treeFileName = availableData[0].treeUrl.substring(9); // url starts with "memory://"
    expect((await fileStore.read(treeFileName)).root).toBe(
      availableData[0].root
    );
  });

  it("should not generate merkle tree if already exists", async () => {
    const merkleTree = new MerkleTreeHandler(
      new MemoryFileStore(""),
      await testGroup.data()
    );
    await fileStore.write(merkleTree.treeFilename, {
      root: "fakeRoot",
    });
    const availableData = await availableGroup.compute();
    expect(availableData).toHaveLength(1);
    expect(availableData[0].root).toBe("fakeRoot");
    const treeFileName = availableData[0].treeUrl.substring(9); // url starts with "memory://"
    expect(await fileStore.read(treeFileName)).toEqual({
      root: "fakeRoot",
    });
  });

  it("should not write data if already exists", async () => {
    const merkleTree = new MerkleTreeHandler(
      new MemoryFileStore(""),
      await testGroup.data()
    );
    await fileStore.write(merkleTree.dataFilename, {
      "0x100": 100,
    });
    const availableData = await availableGroup.compute();
    expect(availableData).toHaveLength(1);
    const dataFileName = availableData[0].dataUrl.substring(9); // url starts with "memory://"
    expect(await fileStore.read(dataFileName)).toEqual({
      "0x100": 100,
    });
  });

  it("should generate an available data with multiple chunks and verify data", async () => {
    const availableData = await availableGroup.compute(1);
    expect(availableData).toHaveLength(2);
    expect(availableData[0].chunk.chunkNumber).toBe(0);
    expect(availableData[1].chunk.chunkNumber).toBe(1);
  });
});
