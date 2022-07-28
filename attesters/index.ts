import { Attester } from "../src/topics/attester";
import HydraS1SimpleAttester from "./hydra-s1-simple";

export const attesters: { [name: string]: typeof Attester } = {
  "hydra-s1-simple": HydraS1SimpleAttester,
};
