import { SNARK_FIELD } from "@sismo-core/crypto";
import { BigNumber, ethers } from "ethers";
import { GroupWithInternalCollectionIdType } from "../../src/topics/attester";
import { Group, ValueType } from "../../src/topics/group";
import { ChunkedData } from "../../src/helpers";
import FileStore from "../../src/file-store";
import { MerkleTreeHandler } from "./helpers";
import { AccountTree, HydraS1AvailableGroupProperties } from "./";

const MAX_CHUNK_SIZE = 50000;

export class HydraS1AvailableGroup {
  public readonly id: string;
  public readonly properties: HydraS1AvailableGroupProperties;

  protected group: Group;
  protected fileStore: FileStore;

  constructor(
    fileStore: FileStore,
    groupWithId: GroupWithInternalCollectionIdType
  ) {
    this.fileStore = fileStore;
    this.group = groupWithId.group;
    this.properties = {
      internalCollectionId: groupWithId.internalCollectionId,
      generationTimestamp: this.group.timestamp,
      isScore: this.group.valueType == ValueType.Score,
    };
    this.id = HydraS1AvailableGroup.generateId(this.properties);
  }

  public async compute(chunkSize?: number): Promise<AccountTree[]> {
    const accountTrees: AccountTree[] = [];
    const chunkedData = new ChunkedData(
      await this.group.data(),
      chunkSize ?? MAX_CHUNK_SIZE
    );
    for (const chunk of chunkedData.iterate()) {
      const merkleTree = new MerkleTreeHandler(this.fileStore, chunk.data);
      const root = await merkleTree.compute();
      accountTrees.push({
        root: root,
        id: this.id,
        chunk: chunk.metadata,
        group: this.properties,
        metadata: merkleTree.metadata,
        dataUrl: this.fileStore.url(merkleTree.dataFilename),
        treeUrl: this.fileStore.url(merkleTree.treeFilename),
      });
    }
    return accountTrees;
  }

  static generateId(properties: HydraS1AvailableGroupProperties): string {
    return BigNumber.from(
      ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ["uint128", "uint32", "bool"],
          [
            properties.internalCollectionId,
            properties.generationTimestamp,
            properties.isScore,
          ]
        )
      )
    )
      .mod(SNARK_FIELD)
      .toHexString();
  }
}
