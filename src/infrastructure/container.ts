import { container, DependencyContainer, Lifecycle } from "tsyringe";
import { GroupStore } from "../topics/group";
import { AvailableDataStore } from "../topics/attester";
import { LocalGroupStore, MemoryGroupStore } from "./group-store";
import { LocalAvailableDataStore } from "./available-data/local-available-data";
import { MemoryAvailableDataStore } from "./available-data";

container.register<GroupStore>("GroupStore", {
  useValue: new LocalGroupStore(),
});
container.register<AvailableDataStore>("AvailableDataStore", {
  useValue: new LocalAvailableDataStore(),
});

const memoryContainer = container.createChildContainer();
memoryContainer.register<GroupStore>(
  "GroupStore",
  {
    useClass: MemoryGroupStore,
  },
  { lifecycle: Lifecycle.Singleton }
);
memoryContainer.register<AvailableDataStore>(
  "AvailableDataStore",
  {
    useClass: MemoryAvailableDataStore,
  },
  { lifecycle: Lifecycle.Singleton }
);

export const getLocalContainer = (): DependencyContainer => container;
export const getMemoryContainer = (): DependencyContainer => memoryContainer;
