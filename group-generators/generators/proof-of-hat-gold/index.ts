import { gql } from "graphql-request";
import { Tags, ValueType } from "../../../src/topics/group";
import {
  GenerationFrequency,
  GroupGenerator,
} from "../../../src/topics/group-generator";
import { GroupType } from "../../../src/topics/group";
import { dataProviders } from "../../helpers/providers";
import { GenerationContext } from "../../../src/topics/generation-context";

export default class extends GroupGenerator {
  generationFrequency = GenerationFrequency.Once;

  async generate(context: GenerationContext): Promise<GroupType[]> {
    // This group is constituted by all the users who have a sismo.eth domain
    const subgraphHostedServiceProvider =
      new dataProviders.SubgraphHostedServiceProvider({
        url: "https://api.thegraph.com/subgraphs/name/pierregvx/hackparis",
      });

    type POHat = { user: string};

    const validatedBounties = await subgraphHostedServiceProvider.query<{
      alertSents: POHat[];
    }>(
      gql`
        query getAcceptedBounties {
          alertSents(where: { isAccepted: true,quality:0}){
            user
            
          }
        }
      `
    );
console.log("bounties",validatedBounties,validatedBounties.alertSents)
    const fetchedData: { [address: string]: number } = {};

    for (const domain of validatedBounties.alertSents) {
      fetchedData[domain.user] = (fetchedData[domain.user] ?? 0) + 1;
    }

    return [
      {
        name: "sismo-domains",
        timestamp: context.timestamp,
        data: fetchedData,
        valueType: ValueType.Score,
        tags: [Tags.Mainnet, Tags.POAP, Tags.User],
      },
    ];
  }
}
