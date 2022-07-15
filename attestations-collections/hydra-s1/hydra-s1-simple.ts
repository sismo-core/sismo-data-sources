import sismoCitizens from "../../group-generators/generators/sismo-citizens";
import sismoDiggers from "../../group-generators/generators/sismo-diggers";
import sismoAndMasqueradeLensFollowers from "../../group-generators/generators/sismo-and-masquerade-lens-followers";
import { AttestationsCollection } from "../../src/attestations-collection/attestations-collection";
import { Badge } from "../../src/badge/badge";
import { Attester } from "../../src/attester/attester";
import ethereumPowerUsers from "../../group-generators/generators/ethereum-power-users";

export const hydraS1SimpleAttester = async () =>
  new Attester({
    collectionIdFirst: 100001,
    attestationsCollections: [
      // Sismo friends
      new AttestationsCollection({
        groups: [await sismoDiggers.getLatestGroup()],
        badge: new Badge({
          name: "ZK Badge: Sismo Digger",
          description: "ZK Badge received by early contributors of Sismo",
          image: "./badges/badge_digger.svg",
          requirements: [],
        }),
      }),
      new AttestationsCollection({
        groups: [await sismoCitizens.getLatestGroup()],
        badge: new Badge({
          name: "ZK Badge: Sismo Citizen",
          description: "ZK Badge received by early supporters of Sismo",
          image: "./badges/badge_citizen.svg",
          requirements: [],
        }),
      }),
      new AttestationsCollection({
        groups: [], // await sismoGuests.getLatestGroup()
        badge: new Badge({
          name: "ZK Badge: Sismo Guest",
          description:
            "ZK Badge received by community members of frens of Sismo",
          image: "./badges/badge_guest.svg",
          requirements: [],
        }),
      }),
      // Masquerade
      new AttestationsCollection({
        groups: [await sismoAndMasqueradeLensFollowers.getLatestGroup()],
        badge: new Badge({}),
      }),
      // Ethereum-power-users
      new AttestationsCollection({
        groups: [await ethereumPowerUsers.getLatestGroup()],
        badge: new Badge({}),
      }),
    ],
  });
