import { inject, injectable } from "tsyringe";
import { BigNumberish } from "ethers";
import { AttestationsCollection } from "../attestations-collection";
import { GroupStore } from "../group";
import {
  AvailableGroupsMetadata,
  GroupWithInternalCollectionIdType,
} from "./attester.types";
import { AvailableDataStore } from "./available-data-store";

@injectable()
export class Attester {
  public name: string;
  public attestationsCollections: AttestationsCollection[];
  public collectionIdFirst: BigNumberish;

  constructor(
    @inject("GroupStore") protected groupStore: GroupStore,
    @inject("AvailableDataStore")
    public availableDataStore: AvailableDataStore
  ) {}

  public sendOnChain(): void {
    throw Error("sendOnChain method must be implemented!");
  }

  protected async makeGroupsAvailable(): Promise<AvailableGroupsMetadata> {
    throw Error("makeGroupsAvailable method must be implemented!");
  }

  public async compute(): Promise<void> {
    await this.availableDataStore.save({
      attesterName: this.name,
      timestamp: Math.floor(Date.now() / 1000),
      metadata: await this.makeGroupsAvailable(),
    });
  }

  public async *fetchGroups(): AsyncGenerator<GroupWithInternalCollectionIdType> {
    for (const attestationCollection of this.attestationsCollections) {
      for (const group of await attestationCollection.groupFetcher()) {
        yield {
          internalCollectionId: attestationCollection.internalCollectionId,
          group: group,
        };
      }
    }
  }
}
