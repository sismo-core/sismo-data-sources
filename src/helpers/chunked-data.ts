export type ChunkMetadataType = {
  chunkNumber: number;
  totalChunks: number;
  min: string;
  max: string;
};

export type ChunkType<T> = {
  metadata: ChunkMetadataType;
  data: { [key: string]: T };
};

export class ChunkedData<T> {
  private readonly _data: { [key: string]: T };
  public readonly keys: string[];
  public readonly chunkSize: number;
  public readonly totalChunks: number;

  constructor(data: { [key: string]: T }, chunkSize: number) {
    this._data = data;
    this.keys = Object.keys(this._data).sort();
    this.chunkSize = chunkSize;
    this.totalChunks = Math.ceil(this.keys.length / chunkSize);
  }

  *iterate(): Generator<ChunkType<T>, void, undefined> {
    for (
      let chunkNumber = 0;
      chunkNumber < this.totalChunks;
      chunkNumber += 1
    ) {
      const chunkData: { [key: string]: T } = {};
      const lastIndex =
        Math.min(
          chunkNumber * this.chunkSize + this.chunkSize,
          this.keys.length
        ) - 1;
      for (let i = chunkNumber * this.chunkSize; i <= lastIndex; i += 1) {
        chunkData[this.keys[i]] = this._data[this.keys[i]];
      }
      yield {
        metadata: {
          chunkNumber: chunkNumber,
          totalChunks: this.totalChunks,
          min: this.keys[chunkNumber * this.chunkSize],
          max: this.keys[lastIndex],
        },
        data: chunkData,
      };
    }
  }
}
