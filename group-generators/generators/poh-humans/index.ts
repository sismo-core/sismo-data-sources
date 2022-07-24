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
    // This group is constituted by all the PoH submissions
    const subgraphHostedServiceProvider =
      new dataProviders.SubgraphHostedServiceProvider({
        // We can't use Kleros hosted service because : The `skip` argument must be between 0 and 5000
        // and there are more than 5000 submissions.
        // Rather we use the decentralized protocol with the Studio API key.
        url: 'https://gateway.thegraph.com/api/d98c97feb09f87d2d86956a815a5dbb5/subgraphs/id/CvzNejNZR2UTQ66wL7miGgfWh9dmiwgTtTfgQCBvMQRE',
      });

    type PoHSubmissions = { id: string, submissionTime: number };

    let allSubmissions: PoHSubmissions[] = [];
    let pohSubmissions: {submissions: PoHSubmissions[]};
    let counter = 0;
    do {
      pohSubmissions = await subgraphHostedServiceProvider.query<{
        submissions: PoHSubmissions[];
      }>(
          gql`
        query getValidPoHSubmissions {
          submissions(where:{registered:true, disputed:false}, first: 1000, skip:${counter}) {
            id
            submissionTime
          }
        }
      `
      );
      allSubmissions = [...allSubmissions, ...pohSubmissions.submissions];
      counter += 1000;
    } while (pohSubmissions.submissions.length > 0)

    const fetchedData: { [address: string]: number } = {};

    for (const submission of allSubmissions) {
      const submissionDate = new Date();
      submissionDate.setTime(submission.submissionTime * 1000);
      // Set the date to 2 to be sure that every timezone will evaluate the same month
      // (E.g: If set to 1, GMT+2 gets 2021/08/01 00:00:00 and GMT gets 2021/07/31 22:00:00)
      const anonymisedDate = new Date(submissionDate.getFullYear(), submissionDate.getMonth(), 2, 0,0, 0, 0)
      fetchedData[submission.id] = anonymisedDate.getTime() / 1000;
    }

    return [
      {
        name: "poh-humans",
        timestamp: context.timestamp,
        data: fetchedData,
        valueType: ValueType.Score,
        tags: [Tags.Mainnet, Tags.AntiSybil, Tags.User],
      },
    ];
  }
}
