import "reflect-metadata";

import { Cache } from "@/cache/cache";

describe("Cache", () => {
  let cache: Cache<string, number>;

  beforeEach(() => {
    cache = new Cache<string, number>();
  });

  afterEach(() => {
    cache.clear();
  });

  it("should set a value in the cache", () => {
    cache.set("key1", 100);
    expect(cache.get("key1")).toBe(100);
  });

  it("should return undefined for expired cache item", async () => {
    cache.set("key2", 200, 1);
    const now = Date.now();
    Date.now = jest.fn(() => now + 2000);

    expect(cache.get("key2")).toBeUndefined();
  });

  it("should delete a cache item", () => {
    cache.set("key3", 300);
    cache.delete("key3");
    expect(cache.get("key3")).toBeUndefined();
  });

  it("should clear the cache", () => {
    cache.set("key4", 400);
    cache.set("key5", 500);
    cache.clear();
    expect(cache.get("key4")).toBeUndefined();
    expect(cache.get("key5")).toBeUndefined();
  });
});
