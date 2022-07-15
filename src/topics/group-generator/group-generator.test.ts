import { GenerationContext, createContext } from "../generation-context";
import { FetchedData, Group, Tags, ValueType } from "../group";
import { GroupGenerator } from "./group-generator";
import { GenerationFrequency } from "./group-generator.types";

describe("test group generator", () => {
  let generationContext: GenerationContext;
  let simpleGroupGenerator: GroupGenerator;

  beforeAll(async () => {
    generationContext = await createContext({ blockNumber: 123456789 });
    simpleGroupGenerator = new GroupGenerator({
      generate: async (context: GenerationContext): Promise<Group[]> => {
        const data: FetchedData = {
          "0x411C16b4688093C81db91e192aeB5945dCA6B785": 1,
          "0xFd247FF5380d7DA60E9018d1D29d529664839Af2": 3,
        };
        return [
          new Group({
            name: "test-group",
            timestamp: context.timestamp,
            data: data,
            valueType: ValueType.Info,
            tags: [Tags.Vote, Tags.Mainnet],
          }),
        ];
      },
      generationFrequency: GenerationFrequency.Once,
    });
  });

  test("Should generate a group with the generator", async () => {
    await simpleGroupGenerator.generate(generationContext);
  });
});
