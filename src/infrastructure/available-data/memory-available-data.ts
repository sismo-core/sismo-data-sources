import { AvailableDataStore, AvailableDataType } from "../../topics/attester";

export class MemoryAvailableDataStore extends AvailableDataStore {
  protected _store: AvailableDataType[] = [];

  async all(): Promise<AvailableDataType[]> {
    return this._store;
  }

  async save(availableData: AvailableDataType): Promise<void> {
    this._store.push(availableData);
  }
}
