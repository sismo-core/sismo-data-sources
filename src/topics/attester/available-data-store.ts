import { AvailableDataSearch, AvailableDataType } from "./attester.types";

export abstract class AvailableDataStore {
  public abstract all(): Promise<AvailableDataType[]>;
  public abstract save(availableData: AvailableDataType): Promise<void>;

  public async search({
    attesterName,
    latest,
  }: AvailableDataSearch): Promise<AvailableDataType[]> {
    const availableData = (await this.all()).filter(
      (availableData) => availableData.attesterName == attesterName
    );
    return latest ? this._latest(availableData) : availableData;
  }

  protected _latest(availableData: AvailableDataType[]) {
    if (availableData.length == 0) {
      return [];
    }
    let latest = availableData[0];
    for (const item of availableData) {
      if (item.timestamp > latest.timestamp) {
        latest = item;
      }
    }
    return [latest];
  }
}
