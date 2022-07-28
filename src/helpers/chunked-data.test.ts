import { ChunkedData, ChunkType } from "./";

describe("test chunked data", () => {
  const exampleData = {
    key3: 3,
    key1: 1,
    key2: 2,
  };

  it("Should create a chunked data and get valid total chunk", async () => {
    expect(new ChunkedData<number>(exampleData, 1).totalChunks).toBe(3);
    expect(new ChunkedData<number>(exampleData, 2).totalChunks).toBe(2);
  });

  it("Should create a chunked data and get keys sorted", async () => {
    expect(new ChunkedData<number>(exampleData, 2).keys).toEqual([
      "key1",
      "key2",
      "key3",
    ]);
  });

  it("Should create a chunked data and get valid chunks 1/2", async () => {
    const chunkData = new ChunkedData<number>(exampleData, 2);
    const chunks: ChunkType<number>[] = [];

    for (const chunk of chunkData.iterate()) {
      chunks.push(chunk);
    }
    expect(chunks).toHaveLength(2);
    expect(chunks[0]).toEqual({
      chunkNumber: 0,
      totalChunks: 2,
      min: "key1",
      max: "key2",
      data: { key1: 1, key2: 2 },
    });
    expect(chunks[1]).toEqual({
      chunkNumber: 1,
      totalChunks: 2,
      min: "key3",
      max: "key3",
      data: { key3: 3 },
    });
  });

  it("Should create a chunked data and get valid chunks 2/2", async () => {
    const chunkData = new ChunkedData<number>(exampleData, 1);
    const chunks: ChunkType<number>[] = [];

    for (const chunk of chunkData.iterate()) {
      chunks.push(chunk);
    }
    expect(chunks).toHaveLength(3);
    expect(chunks[0]).toEqual({
      chunkNumber: 0,
      totalChunks: 3,
      min: "key1",
      max: "key1",
      data: { key1: 1 },
    });
    expect(chunks[1]).toEqual({
      chunkNumber: 1,
      totalChunks: 3,
      min: "key2",
      max: "key2",
      data: { key2: 2 },
    });
    expect(chunks[2]).toEqual({
      chunkNumber: 2,
      totalChunks: 3,
      min: "key3",
      max: "key3",
      data: { key3: 3 },
    });
  });
});
