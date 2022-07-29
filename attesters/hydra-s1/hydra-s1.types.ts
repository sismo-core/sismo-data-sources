import { ChunkMetadataType } from "../../src/helpers";

export type HydraS1AvailableGroupProperties = {
  internalCollectionId: number;
  generationTimestamp: number;
  isScore: boolean;
};

export type AccountTree = {
  root: string;
  id: string;
  chunk: ChunkMetadataType;
  group: HydraS1AvailableGroupProperties;
  metadata: {
    leavesCount: number;
  };
  dataUrl: string;
  treeUrl: string;
};
