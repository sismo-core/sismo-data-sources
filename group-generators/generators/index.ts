import EnsVoters from "./ens-voters";
import EthereumDevelopers from "./ethereum-developers";
import EthereumMostTransactions from "./ethereum-most-transactions";
import EthereumPowerUsers from "./ethereum-power-users";
import LensProfiles from "./lens-profiles";
import MasqueradeLensFollowers from "./masquerade-lens-followers";
import PoolyLawyerMinters from "./pooly-lawyer-minters";
import PoolyMinters from "./pooly-minters";
import proofOfHatBronze from "./proof-of-hat-bronze";
import proofOfHatGold from "./proof-of-hat-gold";
import proofOfHatSilver from "./proof-of-hat-silver";
import SismoAndMasqueradeLensFollowers from "./sismo-and-masquerade-lens-followers";
import SismoCitizens from "./sismo-citizens";
import SismoDiggers from "./sismo-diggers";
import SismoDomain from "./sismo-domains";
import SismoGuest from "./sismo-guests";
import SismoLensFollowers from "./sismo-lens-followers";
import SismoMasqueradeLensFollowers from "./sismo-masquerade-lens-followers";

export const getGenerators = () => ({
  "ens-voters": new EnsVoters(),
  "ethereum-developers": new EthereumDevelopers(),
  "ethereum-most-transactions": new EthereumMostTransactions(),
  "ethereum-power-users": new EthereumPowerUsers(),
  "lens-profiles": new LensProfiles(),
  "masquerade-lens-followers": new MasqueradeLensFollowers(),
  "pooly-lawyer-minters": new PoolyLawyerMinters(),
  "pooly-minters": new PoolyMinters(),
  "sismo-and-masquerade-lens-followers": new SismoAndMasqueradeLensFollowers(),
  "sismo-citizens": new SismoCitizens(),
  "sismo-diggers": new SismoDiggers(),
  "sismo-domains": new SismoDomain(),
  "sismo-guests": new SismoGuest(),
  "sismo-lens-followers": new SismoLensFollowers(),
  "sismo-masquerade-lens-followers": new SismoMasqueradeLensFollowers(),
  "proof-of-hat-gold": new proofOfHatGold(),
  "proof-of-hat-silver": new proofOfHatSilver(),
  "proof-of-hat-bronze": new proofOfHatBronze(),
});
