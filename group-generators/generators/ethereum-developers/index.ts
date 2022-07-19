import { Group, Tags, ValueType } from "../../../src/topics/group";
import {
  GenerationFrequency,
  GroupGenerator,
} from "../../../src/topics/group-generator";
import BigQueryProvider from "../../helpers/providers/big-query/big-query";

/*
  Ethereum Developers group is constituted of Ethereum accounts that deployed at least one contract
  on mainnet or on polygon
*/
export default class extends GroupGenerator {
  generationFrequency = GenerationFrequency.Once;

  async generate(): Promise<Group[]> {
    const bigQueryProvider = new BigQueryProvider();
    const queryMainnet = `
    select from_address as address, count(*) as value from \`bigquery-public-data.crypto_ethereum.transactions\` 
          where to_address is null
          group by from_address
          order by from_address;
    `;
    const mainnetContractDeployers = await bigQueryProvider.fetch(queryMainnet);

    return [
      new Group({
        timestamp: this.context.timestamp,
        name: "ethereum-developers",
        data: mainnetContractDeployers,
        valueType: ValueType.Info,
        tags: [Tags.User, Tags.Mainnet],
      }),
    ];
  }
}
