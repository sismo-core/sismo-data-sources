import { Group } from "../group";

export type AvailableGroupsMetadata = {
  url: string;
};

export type AvailableDataType = {
  attesterName: string;
  timestamp: number;
  metadata: AvailableGroupsMetadata;
};

export type GroupWithInternalCollectionIdType = {
  internalCollectionId: number;
  group: Group;
};

export type AvailableDataSearch = {
  attesterName: string;
  latest?: boolean;
};
