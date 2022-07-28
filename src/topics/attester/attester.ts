import { BigNumberish } from "ethers";
import { inject, injectable } from "tsyringe";
import { AttestationsCollection } from "../attestations-collection";
import { GroupStore } from "../group";
import { AttesterNetworkConfiguration } from "./attester.types";

@injectable()
export class Attester {
  public attestationsCollections: AttestationsCollection[];
  public firstCollectionId: BigNumberish;
  public networkConfigurations: {
    [key: string]: AttesterNetworkConfiguration;
  };

  constructor(@inject("GroupStore") protected groupStore: GroupStore) {}
}
