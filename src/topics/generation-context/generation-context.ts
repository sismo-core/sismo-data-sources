import { getCurrentBlockNumber } from "../../helpers";
import {
  GenerationContext,
  GenerationContextConstructor,
} from "./generation-context.types";

export const createContext = async ({
  blockNumber,
  timestamp,
}: GenerationContextConstructor): Promise<GenerationContext> => {
  if (!blockNumber) {
    blockNumber = process.env.BLOCK_NUMBER
      ? parseInt(process.env.BLOCK_NUMBER)
      : await getCurrentBlockNumber();
  }

  if (!timestamp) {
    timestamp = process.env.GENERATION_TIMESTAMP
      ? parseInt(process.env.GENERATION_TIMESTAMP)
      : Math.floor(Date.now() / 1000);
  }

  return {
    blockNumber,
    timestamp: timestamp,
  };
};
