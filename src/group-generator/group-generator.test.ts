import {
  GenerationFrequency,
  GeneratorContext,
  GroupGenerator,
} from "../../src/group-generator";
import { FetchedData, Group, Tags, ValueType } from "../group";
import { mockContext } from "../../group-generators/helpers/test/mock";
import { GenerationContext } from "../helpers/utils/generation-context";
import sismoCitizens from "../../group-generators/generators/sismo-citizens";

describe("test group generator", () => {
  let generationContext: GenerationContext;
  let simpleGroupGenerator: GroupGenerator;

  beforeAll(async () => {
    generationContext = mockContext();
    simpleGroupGenerator = new GroupGenerator({
      name: "test-generator",
      generate: async (context: GeneratorContext): Promise<Group> => {
        const data: FetchedData = {
          "0x411C16b4688093C81db91e192aeB5945dCA6B785": 1,
          "0xFd247FF5380d7DA60E9018d1D29d529664839Af2": 3,
        };
        return new Group({
          generationDate: new Date(context.timestamp),
          data: data,
          valueType: ValueType.Info,
          tags: [Tags.Vote, Tags.Mainnet],
        });
      },
      generationFrequency: GenerationFrequency.Once,
    });
  });

  test("Should generate a group with the generator", async () => {
    const generatedGroup = await simpleGroupGenerator.generate(
      generationContext
    );
    simpleGroupGenerator.getLatestGroup = jest
      .fn()
      .mockReturnValue(generatedGroup);
    console.log("generatedGroup", generatedGroup);
    console.log(simpleGroupGenerator.getLatestGroup());
    console.log(sismoCitizens);
  });
});
