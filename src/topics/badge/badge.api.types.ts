import { BigNumberish } from "ethers";

export type BadgeAPIType = {
  collectionId: BigNumberish;
  metadata: {
    name: string;
    description: string;
    attributes: string[];
    image: string;
  };
};
