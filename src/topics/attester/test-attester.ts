import { injectable } from "tsyringe";
import { AttestationsCollection } from "../attestations-collection";
import { Group, ValueType } from "../group";
import { Badge } from "../badge";
import { Attester } from "./attester";
import { AvailableGroupsMetadata } from "./attester.types";

@injectable()
export class TestAttester extends Attester {
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
    new AttestationsCollection({
      internalCollectionId: 1,
      groupFetcher: async () => [
        new Group(this.groupStore, {
          name: "test-group2",
          timestamp: 3,
          data: { "0x5": 1, "0x6": 1 },
          tags: [],
          valueType: ValueType.Info,
        }),
      ],
      badge: new Badge({
        name: "Test Badge 2",
        description: "Test Badge 2",
        image: "./badges/test2.svg",
        requirements: [],
      }),
    }),
  ];

  protected async makeGroupsAvailable(): Promise<AvailableGroupsMetadata> {
    return {
      url: "https://fake-available-data-url/",
    };
  }
}
