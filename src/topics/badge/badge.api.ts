import { BigNumberish } from "ethers";
import { FastifyInstance, FastifyRequest } from "fastify";
import { Attester, AttesterNetwork } from "../attester";
import { Badge } from "./badge";
import { BadgeAPIType } from "./badge.api.types";

type BadgeQueryType = FastifyRequest<{
  Params: {
    network: AttesterNetwork;
  };
}>;

type NetworkBadgeQueryType = FastifyRequest<{
  Params: {
    network: AttesterNetwork;
    badgeId: string;
  };
}>;

export function serializeBadgeApiType(
  badge: Badge,
  internalCollectionId: BigNumberish,
  attester: Attester
): BadgeAPIType {
  return {
    collectionId: badge.computeCollectionId(
      internalCollectionId,
      attester.firstCollectionId
    ),
    metadata: {
      name: badge.name,
      description: badge.description,
      attributes: badge.requirements,
      image: badge.image,
    },
  };
}

const routes = async (fastify: FastifyInstance) => {
  /**
   * Returns all the badges from a specific network.
   * @returns 404 when the Badges or the Network are not found, 200 otherwise with the BadgeAPIType[]
   */
  fastify.get(
    "/badges/:network/badges.json",
    async (req: BadgeQueryType, res) => {
      const { network } = req.params;

      const badges: BadgeAPIType[] = [];
      const attesters = Object.values(fastify.attesters).filter(
        (attester) => network in attester.networkConfigurations
      );
      for (const attester of attesters) {
        for (const [
          index,
          collection,
        ] of attester.attestationsCollections.entries()) {
          badges.push(serializeBadgeApiType(collection.badge, index, attester));
        }
      }

      if (badges.length === 0) {
        return res.status(404).send({
          error: `No badges found on this network`,
        });
      }

      return badges;
    }
  );

  /**
   * Returns a specific badge from a specific network.
   * @returns 404 when the Badge or the Network is not found, 200 otherwise with the BadgeAPIType
   */
  fastify.get(
    "/badges/:network/:badgeId.json",
    async (req: NetworkBadgeQueryType, res) => {
      const { network, badgeId } = req.params;

      const badges: BadgeAPIType[] = [];
      const attesters = Object.values(fastify.attesters).filter(
        (attester) => network in attester.networkConfigurations
      );
      for (const attester of attesters) {
        for (const [
          index,
          collection,
        ] of attester.attestationsCollections.entries()) {
          badges.push(serializeBadgeApiType(collection.badge, index, attester));
        }
      }
      const badge = badges.find(
        (serializedBadge) => serializedBadge?.collectionId === badgeId
      );

      if (badge === undefined) {
        return res.status(404).send({
          error: "Badge not found on this network",
        });
      }

      res.send(badge.metadata);
    }
  );
};

export default routes;
