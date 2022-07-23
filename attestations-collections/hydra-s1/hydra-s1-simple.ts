import { AttestationsCollection } from "../../src/topics/attestations-collection/attestations-collection";
import { Badge } from "../../src/topics/badge";
import { Attester } from "../../src/topics/attester";
import { Group } from "../../src/topics/group";

export const hydraS1SimpleAttester = async () =>
  new Attester({
    collectionIdFirst: 10000001,
    attestationsCollections: [
      // Sismo friends
      new AttestationsCollection({
        groups: [await Group.store.latest("sismo-diggers")],
        badge: new Badge({
          name: "ZK Badge: Sismo Digger",
          description: "ZK Badge received by early contributors of Sismo",
          image: "./badges/sismo_digger.svg",
          requirements: [],
        }),
      }),
      new AttestationsCollection({
        groups: [await Group.store.latest("sismo-citizens")],
        badge: new Badge({
          name: "ZK Badge: Sismo Citizen",
          description: "ZK Badge received by early supporters of Sismo",
          image: "./badges/sismo_citizen.svg",
          requirements: [],
        }),
      }),
      new AttestationsCollection({
        groups: [], // [await Group.store.latest("sismo-guests")],
        badge: new Badge({
          name: "ZK Badge: Sismo Guest",
          description:
            "ZK Badge received by community members of frens of Sismo",
          image: "./badges/sismo_guest.svg",
          requirements: [],
        }),
      }),
      // Masquerade
      new AttestationsCollection({
        groups: [await Group.store.latest("sismo-masquerade-lens-followers")],
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
        groups: [await Group.store.latest("ethereum-power-users")],
        badge: new Badge({
          name: "Ethereum Power Users ZK Badge",
          description: "ZK Badge owned by the most active users of Ethereum",
          image: "./badges/ethereum_power_users.svg",
          requirements: [],
        }),
        //pohgold
        
      }),
      new AttestationsCollection({
        groups: [await Group.store.latest("proof-of-hat-bronze")],
        badge: new Badge({
          name: "Bronze proof of hat",
          description: "helped ",
          image: "./badges/ZK_BADGE_BRONZE.svg",
          requirements: [],
        }),
      }),
      new AttestationsCollection({
        groups: [await Group.store.latest("proof-of-hat-silver")],
        badge: new Badge({
          name: "Silver proof of hat",
          description: "Silver bounty completed",
          image: "./badges/ZK_BADGE_SILVER.svg",
          requirements: [],
        }),
      }),
      new AttestationsCollection({
        groups: [await Group.store.latest("proof-of-hat-gold")],
        badge: new Badge({
          name: "Gold proof of hat",
          description: "Gold bounty completed",
          image: "./badges/ZK_BADGE_GOLD.svg",
          requirements: [],
        }),
      })
    ],
  });
