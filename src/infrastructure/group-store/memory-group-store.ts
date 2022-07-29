import { FetchedData, Group, GroupStore, GroupType } from "../../topics/group";
import { MemoryFileStore } from "../file-store";

export class MemoryGroupStore extends GroupStore {
  _groupsStore: GroupType[];
  _dataStore: MemoryFileStore;

  constructor() {
    super();
    this.clear();
  }

  async all(): Promise<Group[]> {
    return this._groupsStore.map((group) => new Group(this, group));
  }

  clear(): void {
    this._groupsStore = [];
    this._dataStore = new MemoryFileStore("");
  }

  dataUrl(group: Group): string {
    return this._dataStore.url(group.filename);
  }

  async getData(group: Group): Promise<FetchedData> {
    return this._dataStore.read(group.filename);
  }

  async save(group: Group): Promise<void> {
    this._groupsStore.push(group.json);
    await this._dataStore.write(group.filename, await group.data());
  }
}
