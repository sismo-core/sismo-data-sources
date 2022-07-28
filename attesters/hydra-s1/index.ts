import { AttestationsCollection } from "../../src/topics/attestations-collection";
import { Attester } from "../../src/topics/attester";
import { Badge } from "../../src/topics/badge";

export default class extends Attester {
  firstCollectionId = 10000001;
  networkConfigurations = {
    polygon: {
      address: "",
    },
  };
  attestationsCollections = [
    // Sismo friends
    new AttestationsCollection({
      groupFetcher: async () => [await this.groupStore.latest("sismo-diggers")],
      badge: new Badge({
        name: "ZK Badge: Sismo Digger",
        description: "ZK Badge received by early contributors of Sismo",
        image: "./badges/sismo_digger.svg",
        requirements: [],
      }),
    }),
    new AttestationsCollection({
      groupFetcher: async () => [
        await this.groupStore.latest("sismo-citizens"),
      ],
      badge: new Badge({
        name: "ZK Badge: Sismo Citizen",
        description: "ZK Badge received by early supporters of Sismo",
        image: "./badges/sismo_citizen.svg",
        requirements: [],
      }),
    }),
    new AttestationsCollection({
      groupFetcher: async () => [], // [await this.groupStore.latest("sismo-guests")]
      badge: new Badge({
        name: "ZK Badge: Sismo Guest",
        description: "ZK Badge received by community members of frens of Sismo",
        image: "./badges/sismo_guest.svg",
        requirements: [],
      }),
    }),
    // Masquerade
    new AttestationsCollection({
      groupFetcher: async () => [
        await this.groupStore.latest("sismo-masquerade-lens-followers"),
      ],
      badge: new Badge({
        name: "Sismo Masquerade Bloomer ZK Badge",
        description:
          "ZK Badge owned by @masquerade.lens and @sismo.lens Lens followers",
        image: "./badges/sismo_masquerade_bloomers.svg",
        requirements: [],
      }),
    }),
    // Ethereum-power-users
    new AttestationsCollection({
      groupFetcher: async () => [
        await this.groupStore.latest("ethereum-power-users"),
      ],
      badge: new Badge({
        name: "Ethereum Power Users ZK Badge",
        description: "ZK Badge owned by the most active users of Ethereum",
        image: "./badges/ethereum_power_users.svg",
        requirements: [],
      }),
    }),
  ];
}
