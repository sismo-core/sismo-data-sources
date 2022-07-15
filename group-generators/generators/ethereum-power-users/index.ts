import { Group, Tags, ValueType } from "../../../src/group";
import {
  GenerationFrequency,
  GeneratorContext,
  GroupGenerator,
} from "../../../src/group-generator";
import { getGroups } from "../../../src/helpers/data-sources-api";
import { dataOperators } from "../../helpers/data-operators";

export default new GroupGenerator({
  name: "ethereum-power-users",
  generate: async (context: GeneratorContext): Promise<Group> => {
    const latestGroupsMostTransactions = await Promise.all(
      ["2016", "2017", "2018", "2019", "2020", "2021"].map(async (year) => {
        return (
          await getGroups({
            generatorName: `ethereum-most-transactions-${year}`,
            timestamp: "latest",
          })
        )[0];
      })
    );

    const ethereumPowerUsers = dataOperators.Join(
      ...latestGroupsMostTransactions.map((group) => group.data)
    );
    return new Group({
      generationDate: new Date(context.timestamp),
      data: ethereumPowerUsers,
      valueType: ValueType.Score,
      tags: [Tags.User, Tags.Mainnet],
    });
  },
  generationFrequency: GenerationFrequency.Once,
});
