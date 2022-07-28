import Fastify from "fastify";
import { DependencyContainer } from "tsyringe";

import { getGenerators } from "../../group-generators/generators";
import { getLocalContainer, InfrastructureServices } from "../infrastructure";
import { GroupGenerator } from "../topics/group-generator";

import { getAttesters } from "../../attesters";
import { Attester } from "../topics/attester";
import badges from "../topics/badge/badge.api";
import groupGenerators from "../topics/group-generator/group-generator.api";
import groups from "../topics/group/group.api";

declare module "fastify" {
  interface FastifyInstance {
    container: DependencyContainer;
    groupGenerators: { [name: string]: GroupGenerator };
    attesters: { [name: string]: Attester };
    services: InfrastructureServices;
  }
}

type Library = {
  groupGenerators?: { [name: string]: GroupGenerator };
  attesters?: { [name: string]: Attester };
};

export const getFastify = (
  log: boolean,
  library?: Library,
  dependencyContainer?: DependencyContainer
) => {
  const fastify = Fastify({
    logger: log,
  });
  const container = dependencyContainer ?? getLocalContainer();
  fastify.decorate("container", container);
  fastify.decorate(
    "groupGenerators",
    library?.groupGenerators ?? getGenerators(container)
  );
  fastify.decorate("attesters", library?.attesters ?? getAttesters(container));
  fastify.decorate("services", {
    groupStore: container.resolve("GroupStore"),
  });
  fastify.register(groups);
  fastify.register(groupGenerators);
  fastify.register(badges);
  return fastify;
};
