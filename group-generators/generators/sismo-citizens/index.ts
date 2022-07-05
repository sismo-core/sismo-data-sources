import { Group, Tags, ValueType } from "../../../src/group";
import {
  GenerationFrequency,
  GeneratorContext,
  GroupGenerator,
} from "../../../src/group-generator";
import { dataOperators } from "../../helpers/data-operators";
import sismoDiggers from "../sismo-diggers";

import sismoDomains from "../sismo-domains";

export default new GroupGenerator({
  name: "sismo-citizens",
  generate: async (context: GeneratorContext): Promise<Group> => {
    const latestSismoDiggersGroup = await sismoDiggers.getLatestGroup();
    const latestSismoDomainsGroup = await sismoDomains.getLatestGroup();

    const sismoCitizensData = dataOperators.Join(
      latestSismoDiggersGroup.data,
      latestSismoDomainsGroup.data
    );

    return new Group({
      generationDate: new Date(context.timestamp),
      data: sismoCitizensData,
      valueType: ValueType.Score,
      tags: [Tags.POAP, Tags.User],
    });
  },
  generationFrequency: GenerationFrequency.Daily,
});
