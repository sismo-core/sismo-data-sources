import { BigNumber, BigNumberish, ethers } from "ethers";

export type BadgeType = {
  name: string;
  description: string;
  image: string;
  requirements: string[];
};

/**
 * @description The representation of a Badge for a specific AttestationsCollection that belongs to a specific Attester.
 */
export class Badge {
  public name: string;
  public description: string;
  public image: string;
  public requirements: string[];

  public constructor(badgeConstructor: BadgeType) {
    this.name = badgeConstructor.name;
    this.description = badgeConstructor.description;
    this.image = badgeConstructor.image;
    this.requirements = badgeConstructor.requirements;
  }

  public computeCollectionId(
    internalCollectionId: BigNumberish,
    attesterFirstCollectionId: BigNumberish
  ): string {
    const collectionId = BigNumber.from(internalCollectionId).add(
      attesterFirstCollectionId
    );

    return ethers.utils.hexZeroPad(collectionId.toHexString(), 32).slice(2);
  }
}
