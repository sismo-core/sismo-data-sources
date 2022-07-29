import crypto from "crypto";
import { BigNumberish } from "ethers";
import { KVMerkleTree } from "@sismo-core/kv-merkle-tree";
import { buildPoseidon } from "@sismo-core/crypto";
import FileStore from "../../src/file-store";

const hashJson = (data: any) =>
  crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");

export type MerkleTreeMetadata = {
  leavesCount: number;
};

export class MerkleTreeHandler {
  protected fileStore: FileStore;
  protected data: { [key: string]: BigNumberish };
  public readonly dataFilename: string;
  public readonly treeFilename: string;
  public readonly metadata: MerkleTreeMetadata;

  constructor(fileStore: FileStore, data: { [key: string]: BigNumberish }) {
    this.fileStore = fileStore;
    this.data = data;
    this.dataFilename = MerkleTreeHandler.getDataFilename(data);
    this.treeFilename = MerkleTreeHandler.getTreeFilename(data);
    this.metadata = {
      leavesCount: Object.keys(this.data).length,
    };
  }

  public async compute(): Promise<string> {
    if (!(await this.fileStore.exists(this.dataFilename))) {
      await this.fileStore.write(this.dataFilename, this.data);
    }
    return this.createMerkleTreeIfNotExists();
  }

  protected async createMerkleTreeIfNotExists(): Promise<string> {
    if (await this.fileStore.exists(this.treeFilename)) {
      return (await this.fileStore.read(this.treeFilename)).root;
    }
    const tree = new KVMerkleTree(
      this.data,
      await buildPoseidon(),
      20
    ).toJson();
    await this.fileStore.write(this.treeFilename, tree);
    return tree.root;
  }

  static getTreeFilename(data: any) {
    const hash = hashJson({
      data: data,
      hashFunction: "poseidon",
      height: 20,
    });
    return `${hash}.tree.json`;
  }

  static getDataFilename(data: any) {
    return `${hashJson(data)}.data.json`;
  }
}
