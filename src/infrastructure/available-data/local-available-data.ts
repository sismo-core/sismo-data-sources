import { AvailableDataStore, AvailableDataType } from "../../topics/attester";
import { LocalFileStore } from "../file-store";

export class LocalAvailableDataStore extends AvailableDataStore {
  localFileStore: LocalFileStore;

  constructor(prefix?: string) {
    super();
    this.localFileStore = new LocalFileStore(prefix ?? "available-data");
  }

  async all(): Promise<AvailableDataType[]> {
    const availableData: AvailableDataType[] = [];
    for (const attesterName of await this.localFileStore.list("./")) {
      for (const filename of await this.localFileStore.list(attesterName)) {
        availableData.push(await this.load(`${attesterName}/${filename}`));
      }
    }
    return availableData;
  }

  async load(filename: string): Promise<AvailableDataType> {
    return await this.localFileStore.read(filename);
  }

  static filename(availableData: AvailableDataType) {
    return `${availableData.attesterName}/${availableData.timestamp}.json`;
  }

  async save(availableData: AvailableDataType): Promise<void> {
    await this.localFileStore.write(
      LocalAvailableDataStore.filename(availableData),
      availableData
    );
  }

  reset(): void {
    this.localFileStore.reset();
  }
}
