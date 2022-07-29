import { container, DependencyContainer, Lifecycle } from "tsyringe";
import { GroupStore } from "../topics/group";
import { AvailableDataStore } from "../topics/attester";
import FileStore from "../file-store";
import { LocalGroupStore, MemoryGroupStore } from "./group-store";
import { LocalAvailableDataStore } from "./available-data/local-available-data";
import { MemoryAvailableDataStore } from "./available-data";
import { LocalFileStore, MemoryFileStore } from "./file-store";

export const getLocalContainer = (): DependencyContainer => {
  const localContainer = container.createChildContainer();
  localContainer.register<GroupStore>("GroupStore", {
    useValue: new LocalGroupStore(),
  });
  localContainer.register<AvailableDataStore>("AvailableDataStore", {
    useValue: new LocalAvailableDataStore(),
  });
  localContainer.register<FileStore>("AvailableGroupStore", {
    useValue: new LocalFileStore("available-groups"),
  });
  return localContainer;
};
export const getMemoryContainer = (): DependencyContainer => {
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
  memoryContainer.register<FileStore>("AvailableGroupStore", {
    useValue: new MemoryFileStore(""),
  });
  return memoryContainer;
};
