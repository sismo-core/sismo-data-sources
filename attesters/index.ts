import { DependencyContainer } from "tsyringe";
import { Attester } from "../src/topics/attester";
import hydraS1Simple from "./hydra-s1";

const attesters: { [name: string]: typeof Attester } = {
  "hydra-s1": hydraS1Simple,
};

export const getAttesters = (
  container: DependencyContainer
): { [name: string]: Attester } => {
  const attestersInstances: { [name: string]: Attester } = {};
  for (const attesterName in attesters) {
    attestersInstances[attesterName] = container.resolve(
      attesters[attesterName]
    );
  }
  return attestersInstances;
};

export const getAttester = (
  container: DependencyContainer,
  attesterName: string
): Attester => container.resolve(attesters[attesterName]);
